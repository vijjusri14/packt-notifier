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

import React, { useEffect, useState } from 'react';
import loader from './loader.svg';

function Notification() {

    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState(null);
    const [author, setAuthor] = useState(null);
    const [publishedOn, setPublishedOn] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [description, setDescription] = useState(null);
    const [coverImage, setCoverImage] = useState('');

    useEffect(() => {
        getOfferData();
    }, [])

    async function getOfferData() {
        async function getTodaysOffer() {
            const utcDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
            const today = utcDate.toISOString();
            const tomorrow = new Date(new Date(utcDate).setDate(utcDate.getDate() + 1)).toISOString();

            const offerURL = `https://services.packtpub.com/free-learning-v1/offers?dateFrom=${today}&dateTo=${tomorrow}`;

            let response = await fetch(offerURL);

            if (response.status === 200) {
                let offerData = await response.json();

                if (offerData.hasOwnProperty('data') && offerData.data.length) {
                    let productId = offerData.data[0].productId;
                    return await getProductSummary(productId);
                }
            }
        }

        async function getProductSummary(productId: number) {
            const productURL = `https://static.packt-cdn.com/products/${productId}/summary`;

            let response = await fetch(productURL);

            if (response.status === 200) {
                let productData = await response.json();

                if (productData.hasOwnProperty('authors') && productData.authors.length) {
                    const authorId = productData.authors[0];
                    const author = await getAuthorDetails(authorId);
                    var { title, pages, publicationDate, oneLiner } = productData;
                    const formatter = new Intl.DateTimeFormat('en-us', { month: 'short', year: 'numeric' });
                    publicationDate = formatter.format(new Date(publicationDate))
                    const coverImage = `https://static.packt-cdn.com/products/${productId}/cover/smaller`;
                    const fileTypes = await getFileTypes(productId);
                    return { productId, title, author, pages, publicationDate, oneLiner, coverImage, fileTypes };
                }
            }
        }

        async function getAuthorDetails(authorId: number) {
            const authorURL = `https://static.packt-cdn.com/authors/${authorId}`

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

        var todaysOffer = await getTodaysOffer();

        setTitle(todaysOffer?.title);
        setAuthor(todaysOffer?.author);
        setPublishedOn(todaysOffer?.publicationDate);
        setPageCount(todaysOffer?.pages);
        setDescription(todaysOffer?.oneLiner);
        setCoverImage(todaysOffer?.coverImage || '');
        setIsLoading(false);
    }

    if (isLoading) {
        return <img className="animate-spin h-32 w-32" src={loader} alt="loader" />
    }

    return (
        <div className="py-8 px-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <img className="block mx-auto h-64 rounded-lg sm:mx-0 sm:shrink-0" src={coverImage} alt="logo" />
            <div className="text-center sm:text-left">
                <p className="text-2xl text-ellipsis overflow-hidden text-black font-semibold">
                    {title}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                    By {author}
                </p>
                <p className="my-2 text-xs text-gray-500 font-medium">
                    Publication date: {publishedOn}
                    <br />
                    Pages: {pageCount}
                </p>
                <div className="md:h-20">
                    <p className="my-2 text-sm text-gray-700 font-medium">
                        {description}
                    </p>
                </div>
                <a href="https://www.packtpub.com/free-learning" target="_blank" rel="noreferrer noopener" className="px-4 py-1 text-sm text-orange-600 font-semibold rounded-full border border-orange-200 hover:text-white hover:bg-orange-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2">Claim</a>
            </div>
        </div>
    )
}

export default Notification
