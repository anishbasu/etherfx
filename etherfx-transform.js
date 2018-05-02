
const ts_types = {
    TSNumberKeyword: "number",
    TSStringKeyword: "string",
    TSBooleanKeyword: "boolean",
    TSVoidKeyword: "void",
    TSNullKeyword: "null",
    TSAnyKeyword: "any"
}

const proto_types = {
    TSNumberKeyword : ['double',
                       'float',
                       'int32',
                       'int64',
                       'uint32',
                       'uint64',
                       'sint32',
                       'sint64',
                       'fixed32',
                       'fixed64',
                       'sfixed32',
                       'sfixed64'],
    TSStringKeyword: ['string', 'bytes'],
    TSBooleanKeyword: ['bool'],
    TSVoidKeyword: ['void'],
    TSNullKeyword: ['null']
}


const getEquivalentTSType = (type) => {
    var equiv_ts = null;
    Object.entries(proto_types).map((entry) => {
        var tsType = entry[0];
        var protoTypes = entry[1];
        if(protoTypes.includes(type)){
            equiv_ts = ts_types[tsType];
        }
    })
    return equiv_ts;
}

const parseParam = (param, t, isReturnType = false) => {
    var ts_param_type, proto_param_type;
    if(param.typeAnnotation){ //Type Defined
        var param_type = param.typeAnnotation
        if(!isReturnType){
            param_type = param_type.typeAnnotation
        }
        if(param_type.type == "TSTypeReference") {
            ts_param_type = getEquivalentTSType(param_type.typeName.name) || param_type.typeName.name
            proto_param_type = param_type.typeName.name
            if(ts_param_type !== proto_param_type) {
                param_type.typeName.name = ts_param_type
            }
        } else {
            ts_param_type = proto_param_type = ts_types[param_type.type]
        }
    } else { //Unknown Type 
        proto_param_type = ts_param_type = "undefined"
    }
    if(!isReturnType){
        return t.objectExpression([
            t.objectProperty(t.identifier(param.name), t.stringLiteral(proto_param_type))
        ])
    } else {
        return t.stringLiteral(proto_param_type)
    }
}

module.exports = (babel) => {
    var t = babel.types;
    return {
        visitor: {
            FunctionExpression: (path) => {
                //Arguments
                var params = path.node.params.map((param, idx) => {
                    return parseParam(param, t)
                })

                var returnType = parseParam(path.node.returnType, t, true)
                var fn_name = path.parentPath.node.id.name
                var methodCall = t.callExpression(
                    t.memberExpression(t.identifier('etherfx'), t.identifier('register')),
                    [
                        t.objectExpression([
                            t.objectProperty(t.identifier("name"), t.stringLiteral(fn_name)),
                            t.objectProperty(t.identifier("function"), t.identifier(fn_name)),
                            t.objectProperty(t.identifier("params"), t.arrayExpression(params)),
                            t.objectProperty(t.identifier("returns"), returnType)
                        ])
                    ]
                )
                path.parentPath.parentPath.insertAfter(methodCall)
            },
            Program: (path) => {
                path.insertAfter(
                    t.callExpression(
                        t.memberExpression(t.identifier('etherfx'), t.identifier('bind')),
                        []
                    )
                )
            }
        }
    };
};