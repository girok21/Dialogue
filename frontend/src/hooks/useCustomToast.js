import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (message, status = "info", duration, isClosable) => {
    toast({
      title: message,
      status,
      duration: duration || 3000,
      isClosable: isClosable || true,
    });
  };

  return { showToast };
};

export default useCustomToast;