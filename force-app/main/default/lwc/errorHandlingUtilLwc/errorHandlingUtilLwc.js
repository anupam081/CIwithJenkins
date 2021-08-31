/**
 * Reduces one or more LDS errors into a string[] of error messages.
 * @param {FetchResponse|FetchResponse[]} errors
 * @return {String[]} Error messages
 */
 export function reduceErrors(errors) {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }
 
    return (
        errors
            // Remove null/undefined items
            .filter((error) => !!error)
            // Extract an error message
            .map((error) => {
                // UI API read errors
                if (error.body.duplicateResults && error.body.duplicateResults.length > 0) {
                    return error.body.duplicateResults.map((e) => e.message);
                }

                else if (error.body.fieldErrors && error.body.fieldErrors.length > 0 && Array.isArray(error.body.fieldErrors)) {
                    return error.body.fieldErrors.map((e) => e.message);
                }

                else if (error.body.pageErrors && error.body.pageErrors.length > 0 && Array.isArray(error.body.pageErrors)) {
                    return error.body.pageErrors.map((e) => e.message);
                }

                else if (Array.isArray(error.body)) {
                    return error.body.map((e) => e.message);
                }
                //validation message
                else if(error.body && typeof error.body.message === 'string' && error.body.message.includes('FIELD_CUSTOM_VALIDATION_EXCEPTION')){
                    return error.body.message.substring(error.body.message.lastIndexOf('FIELD_CUSTOM_VALIDATION_EXCEPTION'));
                }
                // UI API DML, Apex and network errors
                else if (error.body && typeof error.body.message === 'string') {
                    return error.body.message;
                }
                // JS errors
                else if (typeof error.message === 'string') {
                    return error.message;
                }
                // Unknown error shape so try HTTP status text
                return error.statusText;
            })
            // Flatten
            .reduce((prev, curr) => prev.concat(curr), [])
            // Remove empty strings
            .filter((message) => !!message)
    );
}