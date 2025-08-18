import { convertBoxValue } from "src/utils/coreFunction";

export const TagChips = ({ children, color, currency } : any) => {

    var textColor = "";
    var bgColor = "";

    if (color === "red") {
        textColor = "text-red-700";
        bgColor = "bg-red-50";
    }

    if (color === "green") {
        textColor = "text-green-700";
        bgColor = "bg-green-50";
    }

    if (color === "blue") {
        textColor = "text-blue-700";
        bgColor = "bg-blue-50";
    }

    if (color === "purple") {
        textColor = "text-purple-700";
        bgColor = "bg-purple-50";
    }

    return (
        <div className={`font-500 bg- text-10 ${textColor} ${bgColor} rounded-full ${currency ==="USD" ? "px-14" : "px-6"} py-6`}>
            {children}
        </div>
    );
}


export const TagStatus = ({status}) => {
    const isSold = status === "Sold";
    const updatedStatus = isSold ? "Sold" : "In Stock";
    const color = isSold ? "red" : "green";

    return <TagChips color={color}>{updatedStatus}</TagChips>;
}

export const TagPaper = (paperParams) => {
    let paperStatus = 'No warranty';
    let paperColor = 'red';
    if (paperParams == 'ARCHIVE') {
        paperStatus = 'Archive';
        paperColor = 'purple';
    } else if (paperParams != 'N/A' || paperParams != '') {
        paperStatus = 'Warranty';
        paperColor = 'green';
    }

    return <TagChips color={paperColor}>{paperStatus}</TagChips>;
}

// Warranty/No warranty/Archive
// Box included/No box/Add box $+250
export const TagBox = (boxParams, user) => {
    let boxStatus = 'No box';
    let boxColor = 'red';
    if (boxParams == 'INCLUDED') {
        boxStatus = 'Box included';
        boxColor = 'green';
    } else if (boxParams == 'N/A' || boxParams == '') {
        boxStatus = 'No box';
        boxColor = 'red';
    } else {
        boxStatus = `Box ${convertBoxValue(boxParams, user?.currency, user?.exchangeRate )}`;
        boxColor = 'purple';
    }


    return <TagChips color={boxColor} currency={user?.currency}>{boxStatus}</TagChips>;
}