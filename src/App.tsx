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

import { useEffect, useState } from 'react';
import getTodaysOffer from './api/getTodaysOffer';
import './App.scss';
import loader from './assets/loader.svg';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [publishedOn, setPublishedOn] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [description, setDescription] = useState(null);
  const [coverImage, setCoverImage] = useState('');

  const offerLink = 'https://www.packtpub.com/free-learning';

  useEffect(() => {
    getOfferData();
  }, []);

  async function getOfferData() {
    const todaysOffer = await getTodaysOffer();

    setTitle(todaysOffer?.title);
    setAuthor(todaysOffer?.author);
    setPublishedOn(todaysOffer?.publicationDate);
    setPageCount(todaysOffer?.pages);
    setDescription(todaysOffer?.oneLiner);
    setCoverImage(todaysOffer?.coverImage || '');
    setIsLoading(false);
  }

  return (
    <div className="App">
      {isLoading ? (
        <img className="loader" src={loader} alt="loader" />
      ) : (
        <div className="container">
          <img className="coverImage" src={coverImage} alt="logo" />
          <div className="offerSection">
            <p className="bookTitle">{title}</p>
            <p className="authorName">By {author}</p>
            <p className="bookMetadata">
              Publication date: {publishedOn}
              <br />
              Pages: {pageCount}
            </p>
            <div className="descriptionSection">
              <p className="description">{description}</p>
            </div>
            <a
              href={offerLink}
              target="_blank"
              rel="noreferrer noopener"
              className="claimButton"
            >
              Claim
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
