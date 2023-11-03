import { useState } from "react";
import { useToast } from "@chakra-ui/react";


const usePreviewImage = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const toast = useToast();
    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = () => {
                setImgUrl(reader.result);
            }

            reader.readAsDataURL(file);
        }else{
            toast({
                title: 'Invalid file type',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
            setImgUrl(null);
        }
    };
    return {handleImageChange, imgUrl, setImgUrl };
}

export default usePreviewImage;