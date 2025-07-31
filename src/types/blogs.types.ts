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
    name: string
    description: string
    isActive: boolean
}
