

let matchErrorCode = (code) => {
    let error = "INTERNAL ERROR";
    switch (code) {
        case 'SQLITE_CONSTRAINT':
            error = "INPUT_PARAMETER_INVALID";
            break;
        case 'SQLITE_MISMATCH':
            error = "INPUT_DATATYPE_MISMATCHED";
            break
        default:
            error = "INTERNAL_ERROR";
    }
    return error;
}

module.exports = {
    matchErrorCode
}