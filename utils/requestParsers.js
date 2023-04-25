const parseStringToStringArray = (str) => {
    if(!str) {
        return "";
    }
    else {
    return str.split(',').map((value)=> 
        `"${value}"`
    ).join(',');
}
};



module.exports = {
    parseStringToStringArray,
};