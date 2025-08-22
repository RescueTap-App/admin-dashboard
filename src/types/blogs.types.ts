export type BlogListTypes = {
    _id: string;
    featureImage: string;
    title: string;
    content: string;
    categories: string[];
    files?: [];
    author: string;
    createdAt: Date
    isPublished: boolean
}

export type BlogDataTypes = {
    featureImage: string;
    title: string;
    content: string;
    categories: string[];
    author: string;
}

export type CategoryDataType = {
    _id: string;
    name: string
    description: string
    isActive: boolean
}

export type TipListTypes = {
    _id: string;
    content: string;
    createdAt: Date;
    updatedAt:Date;
}
