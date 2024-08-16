export const addCountryCode = (phoneNumber) => {
    const countryCode = '+234'; // Nigeria's country code
    // Check if the phone number already starts with the country code
    if (phoneNumber.startsWith(countryCode)) {
        return phoneNumber;
    }
    // If the phone number starts with '0', remove it before adding the country code
    if (phoneNumber.startsWith('0')) {
        return countryCode + phoneNumber.slice(1);
    }
    return countryCode + phoneNumber;
};
