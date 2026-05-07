const logUtils = {
    logger(message) {
        if(import.meta.env.DEV) console.log(message)
    },
    loggerText(text,message) {
        if(import.meta.env.DEV) console.log(text,message)
    }
}

export default logUtils