import React, { useState, useEffect, useRef } from "react";
import Spinner from "../Spinner/Spinner";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { getPhotos } from "../../services/unsplashService";
import styles from "./PhotoGrid.module.css";

function PhotoGrid() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const observerRef = useRef(null);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await getPhotos(page);
      setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
      if (response.data.length === 0) setHasMore(false);
    } catch (error) {
      console.error("Error fetching photos", error);
    }
    setLoading(false);
  };

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const renderColumn = (columnIndex, totalColumns) => {
    return photos
      .filter((_, index) => index % totalColumns === columnIndex)
      .map((photo) => (
        <img
          key={photo.id}
          src={photo.urls.small}
          alt={photo.alt_description}
          onClick={() => openLightbox(photos.indexOf(photo))}
          className={styles.photoItem}
        />
      ));
  };

  return (
    <>
      <div className={styles.photoGrid}>
        <div className={styles.column}>{renderColumn(0, 3)}</div>
        <div className={styles.column}>{renderColumn(1, 3)}</div>
        <div className={styles.column}>{renderColumn(2, 3)}</div>
      </div>
      <div ref={observerRef} className={styles.observer}></div>
      <div className={styles.spinnerContainer}>
        {loading && <Spinner />}
        {!hasMore && !loading && (
          <span className={styles.noMorePhotos}>No more photos to load</span>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={photos.map((photo) => ({
            src: photo.urls.full,
            title: photo.description || photo.alt_description,
            description: `Photo by ${photo.user.name} on Unsplash`,
          }))}
          index={currentImage}
          plugins={[Captions, Fullscreen, Slideshow]}
        />
      )}
    </>
  );
}

export default PhotoGrid;
