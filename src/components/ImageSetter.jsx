import { AiOutlinePlusCircle } from 'react-icons/ai';
import React, { useRef } from 'react';
import no_avatar from '../images/no_avatar.jpg';
import Resizer from 'react-image-file-resizer';
import { useLocation } from 'react-router-dom';
import { RiEditBoxLine } from 'react-icons/ri';

export default function ImageSetter({ avatarFile, setAvatarFile }) {
  const fileRef = useRef();
  const location = useLocation();

  const isEditMode = location.pathname.includes('edit');

  function resizeImage(imageFile) {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        imageFile,
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64',
      );
    });
  }

  async function setResizedImage(imageFile) {
    const base64uri = await resizeImage(imageFile);
    setAvatarFile(base64uri);
  }

  function removeImage(e) {
    e.preventDefault();
    setAvatarFile('');
    fileRef.current.value = '';
  }

  return (
    <div>
      <div className="ml-8">
        <label
          htmlFor="image"
          className="grid w-32 h-32 mx-auto my-2 bg-cover rounded-full place-items-center"
          style={{
            backgroundImage: `url(${avatarFile || no_avatar})`,
            backgroundSize: 'cover',
          }}
        >
          {isEditMode && avatarFile ? (
            <RiEditBoxLine
              size={30}
              className="text-gray-500 bg-white rounded-xl px-1 border ml-24 mt-24"
            />
          ) : (
            <AiOutlinePlusCircle size={40} className="text-gray-600" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            id="image"
            className="hidden input"
            onChange={(e) => {
              setResizedImage(e.target.files[0]);
            }}
          />
        </label>
        {avatarFile && (
          <button onClick={removeImage} className="text-xs btn">
            Remove image
          </button>
        )}
      </div>
    </div>
  );
}
