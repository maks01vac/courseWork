import fullComparisonJson from "./fullComparisonJson"

const isSimilarResult = (result, results) => {
    const exceptions = ['idPipe']
    for (let i=0; i<results.length; i++) {
        const existenceCheck = fullComparisonJson(result, results[i], exceptions)
        if (existenceCheck === true){
            return false
        }
    }
    return true
}

export default isSimilarResult