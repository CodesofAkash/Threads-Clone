import { useState } from 'react'
import useShowToast from './useShowToast'

const usePreviewImg = () => {
    const showToast = useShowToast();
    
    const [imgUrl, setImgUrl] = useState(null);

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if(file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
            showToast("Invalid file type", "Please select an image file", "error");
            setImgUrl(null);
        }
    }

  return {handleImgChange, imgUrl, setImgUrl};
}

export default usePreviewImg
