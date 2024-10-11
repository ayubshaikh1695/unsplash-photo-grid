import axios from "axios";

const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const API_BASE_URL = "https://api.unsplash.com";
const PHOTOS_ENDPOINT = "/photos";
const PHOTO_PER_PAGE = 10;

export const getPhotos = (page) => {
  return axios.get(`${API_BASE_URL}${PHOTOS_ENDPOINT}`, {
    params: {
      page,
      per_page: PHOTO_PER_PAGE,
    },
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
    },
  });
};
