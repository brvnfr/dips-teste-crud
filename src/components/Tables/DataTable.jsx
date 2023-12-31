import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalComponent from "../layout/Modal";

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [operationType, setOperationType] = useState("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Numero de items por página

  //Filtros
  const [filters, setFilters] = useState({
    id: '',
    username: '',
    groupId: '',
    level: '',
    updatedAt: '',
  });

  useEffect(() => {
    fetchData();
  }, []);


  //Baixar planilha CSV
  const downloadCSV = () => {
    const header = Object.keys(data[0]).join(',');
    const csv = [
      header,
      ...data.map(item => Object.values(item).join(','))
    ].join('\n');
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'data.csv';
    link.click();
  };
  
  // Baixar planilha em Excel
  const downloadExcel = () => {
    // Lógica para exportar para Excel usando uma biblioteca como xlsx ou exceljs
    // Aqui, estou simulando o download do Excel
    const blob = new Blob(['Dados em Excel'], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'data.xls';
    link.click();
  };


  const fetchData = () => {
    fetch('https://sheetdb.io/api/v1/lh7tkv7vr283w')
      .then(response => response.json())
      .then(result => setData(result))
      .catch(error => console.error(error))
  };

  const handleRemove = (id) => {
    fetch(`https://sheetdb.io/api/v1/lh7tkv7vr283w/id/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        console.log(`Item com ID ${id} removido.`);
        const newArray = data.filter((item) => item.id !== id);
        setData(newArray);
      })
      .catch((error) => {
        console.error(`Erro ao remover o item com ID ${id}:`, error);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEdit = ( id, username, groupId, level, index) => {
    setDataEdit({ id, username, groupId, level, index });
    onOpen();
    setOperationType("edit");
  };

  const handleAddUser = () => {
    setDataEdit({});
    onOpen();
    setOperationType("add");
  };

  return (
    <Flex
      align="center"
      justify="center"
      fontSize="20px"
      fontFamily="Roboto"
      overflow="auto"
    >
      <Box w="90%" px={2}>
        <Flex justify="flex-end" mb="4">
          <Button colorScheme="green" onClick={handleAddUser}>
            Adicionar Usuario
          </Button>
  
          <Menu>
            <MenuButton as={Button} colorScheme="blue" mx={2}>
              Baixar
            </MenuButton>
            <MenuList>
              <MenuItem onClick={downloadCSV}>Baixar em CSV</MenuItem>
              <MenuItem onClick={downloadExcel}>Baixar em Excel (XLS)</MenuItem>
            </MenuList>
          </Menu>


        </Flex>

        <Box overflowY="auto" height="100%">
          <Table mt="6">
          <Thead>
                <Tr>
                <Th maxW={100} fontSize="14px">
                  <Input
                    value={filters.id}
                    onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                    placeholder="Por ID"
                    size="sm"
                  />
                </Th>
                <Th maxW={100} fontSize="14px">
                  <Input
                    value={filters.username}
                    onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                    placeholder="Por Usuario"
                    size="sm"
                  />
                </Th>
                <Th maxW={100} fontSize="14px">
                  <Input
                    value={filters.groupId}
                    onChange={(e) => setFilters({ ...filters, groupId: e.target.value })}
                    placeholder="Por Grupo ID"
                    size="sm"
                  />
                </Th>
                <Th maxW={100} fontSize="14px">
                  <Input
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    placeholder="Por nivel"
                    size="sm"
                  />
                </Th>

                </Tr>
                </Thead>
                <Tbody>
                {data
                    .filter(({ id, username, groupId, level, updatedAt }) => {
                    return (
                        id.includes(filters.id) &&
                        username.toLowerCase().includes(filters.username.toLowerCase()) &&
                        groupId.includes(filters.groupId) &&
                        level.includes(filters.level) &&
                        updatedAt.includes(filters.updatedAt)
                    );
                    })
                    .slice(indexOfFirstItem, indexOfLastItem)
                    .map(({ id, username, groupId, level, updatedAt }, index) => (
                    <Tr key={index} cursor="pointer" _hover={{ bg: "gray.100" }}>
                        <Td maxW={100} fontSize="12px">{id}</Td>
                        <Td maxW={100} fontSize="12px">{username}</Td>
                        <Td maxW={100} fontSize="12px">{groupId}</Td>
                        <Td maxW={100} fontSize="12px">{level}</Td>
                        <Td maxW={100} fontSize="12px">{updatedAt}</Td>
                        <Td p="0">
                        <EditIcon
                            fontSize={16}
                            m={1}
                            onClick={() => handleEdit(id, username, groupId, level, index)}
                        />
                        <DeleteIcon
                            fontSize={16}
                            m={1}
                            onClick={() => handleRemove(id)}
                        />
                        </Td>
                    </Tr>
                    ))}
                </Tbody>

          </Table>
          {data.length > 0 && (
            <Flex justify="flex-end" mb="4">
              <Box my="4">
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "solid" : "outline"}
                    onClick={() => setCurrentPage(number)}
                    mr="2"
                  >
                    {number}
                  </Button>
                ))}
              </Box>
            </Flex>
          )}
        </Box>
      </Box>
      {isOpen && (
        <ModalComponent
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          setData={setData}
          dataEdit={dataEdit}
          setDataEdit={setDataEdit}
          operationType={operationType}
        />
      )}
    </Flex>
  );
};

export default App;
