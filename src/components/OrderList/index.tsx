import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Order, OrderStatus, OrderStatusTranslations } from "@/types/orders";
import {
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          user:user_id (id, email, username, whatsapp_number),
          products:order_product (*, product:product_id (*))
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error fetching orders",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      await fetchOrders();
      toast({
        title: "Success",
        description: "Order status updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error updating order status",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  const toast = useToast();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Pedidos
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Data</Th>
              <Th>Cliente</Th>
              <Th>Produtos</Th>
              <Th>Valor Total</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>
                  {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                </Td>
                <Td>
                  <div>
                    {order.user?.username ||
                      order.user?.email ||
                      "User not found"}
                  </div>
                  {order.user?.whatsapp_number && (
                    <div>WhatsApp: {order.user.whatsapp_number}</div>
                  )}
                </Td>
                <Td>
                  {order.products.map((item) => (
                    <div key={item.product.id}>
                      {item.product.name} x {item.product_quantity}
                    </div>
                  ))}
                </Td>
                <Td>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(order.full_price))}
                </Td>
                <Td>{OrderStatusTranslations[order.status]}</Td>
                <Td>
                  {Object.values(OrderStatus)
                    .filter((status) => typeof status === "number")
                    .map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        isDisabled={order.status === status}
                        onClick={() =>
                          updateOrderStatus(order.id, status as OrderStatus)
                        }
                        mr={2}
                        mb={2}
                      >
                        {OrderStatusTranslations[status as OrderStatus]}
                      </Button>
                    ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
