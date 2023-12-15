import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Flex
} from "@chakra-ui/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente de Input personalizado com validações
const CustomInput = ({ label, value, onChange, type }) => (
  <Box>
    <FormLabel>{label}</FormLabel>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      pattern={type === "text" ? "[A-Za-z]+" : "[0-9]*"}
      title={type === "text" ? "Somente letras são permitidas" : "Somente números são permitidos"}
      required
    />
  </Box>
);

const ModalComponent = ({ data, setData, dataEdit, isOpen, onClose, operationType }) => {
  const [username, setUsername] = useState(dataEdit.username || "");
  const [groupId, setGroupId] = useState(dataEdit.groupId || "");
  const [level, setLevel] = useState(dataEdit.level || "");
  const [id, setId] = useState(dataEdit.id || Math.floor(Math.random() * 1001)); // Use o ID existente ou gere um novo

  const updatedDate = new Date().toISOString().replace('T', ' ').slice(0, -1);
  const updatedAt = updatedDate;

  const handleSave = () => {
    if (!username || !groupId || !level) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const newData = { id, username, groupId, level, updatedAt };

    if (operationType === "edit" && Object.keys(dataEdit).length) {
      // Fazer a operação PATCH para editar
      fetch(`https://sheetdb.io/api/v1/lh7tkv7vr283w/id/${dataEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: {
                'username': `${dataEdit.username}`,
                'groupId': `${dataEdit.groupId}`,
                'level': `${dataEdit.level}`,
                'updatedAt': `${updatedAt}`,
            }
        }
        )
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Dados atualizados com sucesso!");
            const updatedArray = [...data];
            updatedArray[dataEdit.index] = newData;
            setData(updatedArray);
            onClose();
          } else {
            toast.error("Erro ao atualizar os dados.");
          }
        })
        .catch((error) => {
          console.error("Erro ao atualizar os dados:", error);
          toast.error("Erro ao atualizar os dados.");
        });
    } else {
      // Fazer a operação POST para adicionar
      fetch('https://sheetdb.io/api/v1/lh7tkv7vr283w', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: [newData] })
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Dados adicionados com sucesso!");
            const updatedArray = data ? [...data, newData] : [newData];
            setData(updatedArray);
            onClose();
          } else {
            toast.error("Erro ao adicionar os dados.");
          }
        })
        .catch((error) => {
          console.error("Erro ao adicionar os dados:", error);
          toast.error("Erro ao adicionar os dados.");
        });
    }
  };

  useEffect(() => {
    if (operationType === "add") {
      setId(Math.floor(Math.random() * 1001)); // Gera um ID aleatorio na criacao de um novo usuario
    }
  }, [operationType]);

  return (
    <>
    
      <ToastContainer />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
          <Flex justify="center" align="center" height="80vh">
        <ModalContent>
          <ModalHeader>Cadastro de Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" flexDir="column" gap={4}>
              <CustomInput
                label="Usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <CustomInput
                label="Grupo ID"
                type="number"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
              <CustomInput
                label="Nivel"
                type="number"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent="start">
            <Button colorScheme="green" mr={3} onClick={handleSave}>
              SALVAR
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              CANCELAR
            </Button>
          </ModalFooter>
        </ModalContent>
            </Flex>
      </Modal>
    </>
  );
};

export default ModalComponent;
