export function match(param){
    return /^([a-z0-9]{15})$/.test(param);
}