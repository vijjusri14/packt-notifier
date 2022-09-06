/*
 *   Copyright (c) 2022 Vijay Bhaskar
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:

 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.

 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

async function getTodaysOffer() {
    // const utcDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    // const today = utcDate.toISOString();
    // const tomorrow = new Date(new Date(utcDate).setDate(utcDate.getDate() + 1)).toISOString();

    // const offerURL = `https://services.packtpub.com/free-learning-v1/offers?dateFrom=${today}&dateTo=${tomorrow}`;

    // let response = await fetch(offerURL);

    // if (response.status === 200) {
    //     let offerData = await response.json();

    //     if (offerData.hasOwnProperty('data') && offerData.data.length) {
    //         let productId = offerData.data[0].productId;
    //         return await getProductSummary(productId);
    //     }
    // }

    const freeLearningURL = 'https://www.packtpub.com/free-learning';
    const re = /const metaProductId = '(.*?)';/;

    let response = await fetch(freeLearningURL);

    if (response.status === 200) {
        let offerData = await response.text();

        if (offerData.length) {
            //  @ts-ignore: Object is possibly 'null'.
            let productId = parseInt(re.exec(offerData)[1], 10);
            return getProductSummary(productId);
        }
    }
}

async function getProductSummary(productId: number) {
    const productURL = `https://static.packt-cdn.com/products/${productId}/summary`;

    let response = await fetch(productURL);

    if (response.status === 200) {
        let productData = await response.json();

        if (
            productData.hasOwnProperty('authors') &&
            productData.authors.length
        ) {
            const authorId = productData.authors[0];
            const author = await getAuthorDetails(authorId);
            let { title, pages, publicationDate, oneLiner } = productData;
            const formatter = new Intl.DateTimeFormat('en-us', {
                month: 'short',
                year: 'numeric',
            });
            publicationDate = formatter.format(new Date(publicationDate));
            const coverImage = `https://static.packt-cdn.com/products/${productId}/cover/smaller`;
            const fileTypes = await getFileTypes(productId);
            return {
                productId,
                title,
                author,
                pages,
                publicationDate,
                oneLiner,
                coverImage,
                fileTypes,
            };
        }
    }
}

async function getAuthorDetails(authorId: number) {
    const authorURL = `https://static.packt-cdn.com/authors/${authorId}`;

    let response = await fetch(authorURL);

    if (response.status === 200) {
        let authorData = await response.json();

        if (authorData.hasOwnProperty('author')) {
            return authorData.author;
        }
    }
}

async function getFileTypes(productId: number) {
    const fileTypesURL = `https://services.packtpub.com/products-v1/products/${productId}/types`;

    let response = await fetch(fileTypesURL);

    if (response.status === 200) {
        let fileTypeData = await response.json();

        if (fileTypeData.hasOwnProperty('data') && fileTypeData.data.length) {
            return fileTypeData.data[0].fileTypes;
        }
    }
}

export default getTodaysOffer;
