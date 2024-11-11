const logUtils = {
    logger(message) {
        if(process.env.NODE_ENV === 'development') console.log(message)
    },
    loggerText(text,message) {
        if(process.env.NODE_ENV === 'development') console.log(text,message)
    }
}

export default logUtils