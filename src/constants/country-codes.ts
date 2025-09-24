export interface CountryCode {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

export const countryCodes: CountryCode[] = [
    {
        name: "Nigeria",
        code: "NG",
        dialCode: "234",
        flag: "🇳🇬"
    },
    {
        name: "Ghana",
        code: "GH",
        dialCode: "233",
        flag: "🇬🇭"
    },
    {
        name: "Germany",
        code: "DE",
        dialCode: "49",
        flag: "🇩🇪"
    },
    {
        name: "Egypt",
        code: "EG",
        dialCode: "20",
        flag: "🇪🇬"
    },
    {
        name: "South Africa",
        code: "ZA",
        dialCode: "27",
        flag: "🇿🇦"
    },
    {
        name: "United States",
        code: "US",
        dialCode: "1",
        flag: "🇺🇸"
    },
    {
        name: "United Kingdom",
        code: "GB",
        dialCode: "44",
        flag: "🇬🇧"
    }
];
