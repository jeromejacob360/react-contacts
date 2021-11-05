import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import no_avatar from '../images/no_avatar.jpg';

export default function ImageSetter({
  defaultImage,
  avatarFile,
  setAvatarFile,
}) {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (avatarFile) {
      setAvatarUrl(URL.createObjectURL(avatarFile));
    } else {
      setAvatarUrl(null);
    }
  }, [avatarFile]);

  useEffect(() => {
    if (defaultImage) {
      setAvatarUrl(defaultImage);
    }
  }, [defaultImage]);

  function removeImage(e) {
    e.preventDefault();
    setAvatarFile('');
  }

  return (
    <div>
      <div className="ml-8">
        <label
          htmlFor="image"
          className="grid w-32 h-32 mx-auto my-2 bg-cover rounded-full place-items-center"
          style={{
            backgroundImage: `url(${avatarUrl || no_avatar})`,
            backgroundSize: 'cover',
          }}
        >
          <FontAwesomeIcon
            icon={faCamera}
            size="2x"
            className="text-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            id="image"
            className="hidden input"
            onChange={(e) => {
              setAvatarFile(e.target.files[0]);
            }}
          />
        </label>
        {avatarUrl && (
          <button onClick={removeImage} className="text-xs btn">
            Remove image
          </button>
        )}
      </div>
    </div>
  );
}
