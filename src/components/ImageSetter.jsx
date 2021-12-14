import { AiOutlinePlusCircle } from 'react-icons/ai';
import React, { useRef } from 'react';
import no_avatar from '../images/no_avatar.jpg';
import Resizer from 'react-image-file-resizer';
import { useLocation } from 'react-router-dom';
import { RiEditBoxLine } from 'react-icons/ri';
import { BsTrash } from 'react-icons/bs';

export default function ImageSetter({
  avatarFile,
  setAvatarFile,
  setAvatarChanged,
}) {
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
    setAvatarChanged && setAvatarChanged(true);
    setAvatarFile('');
    fileRef.current.value = '';
  }

  return (
    <div className="relative flex flex-col items-center">
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
            className="absolute px-1 mt-24 ml-24 text-blue-500 bg-white border -bottom-2 right-4 rounded-xl"
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
            setAvatarChanged && setAvatarChanged(true);
            setResizedImage(e.target.files[0]);
          }}
        />
      </label>
      {avatarFile && (
        <BsTrash
          size={30}
          className="absolute p-1 text-red-500 bg-white border rounded-full left-4 -bottom-2"
          onClick={removeImage}
        />
      )}
    </div>
  );
}
