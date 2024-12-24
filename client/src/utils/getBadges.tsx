/* eslint-disable indent */
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="bg-green-200 text-green-800 border-none"
        >
          Confirmado
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge
          variant="default"
          className="bg-blue-200 text-blue-800 border-none"
        >
          Ativo
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="secondary"
          className="bg-gray-200 text-gray-800 border-none"
        >
          Completado
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="destructive"
          className="bg-red-200 text-red-800 border-none"
        >
          Cancelado
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-200 text-yellow-800 border-none"
        >
          Pendente
        </Badge>
      );
  }
};

const getActionBadge = (action: string) => {
  switch (action) {
    case "CREATE":
      return (
        <Badge
          variant="default"
          className="bg-green-200 text-green-800 border-none"
        >
          Criar
        </Badge>
      );
    case "UPDATE":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-200 text-yellow-800 border-none"
        >
          Atualizar
        </Badge>
      );
    case "DELETE":
      return (
        <Badge
          variant="destructive"
          className="bg-red-200 text-red-800 border-none"
        >
          Deletar
        </Badge>
      );
  }
};

const getEntityBadge = (entity: string) => {
  switch (entity) {
    case "USER":
      return (
        <Badge
          variant="default"
          className="bg-purple-200 text-purple-800 border-none"
        >
          Usuário
        </Badge>
      );
    case "ROOM":
      return (
        <Badge
          variant="default"
          className="bg-teal-200 text-teal-800 border-none"
        >
          Sala
        </Badge>
      );
    case "RESOURCE":
      return (
        <Badge
          variant="default"
          className="bg-pink-200 text-pink-800 border-none"
        >
          Recurso
        </Badge>
      );
    case "BOOKING":
      return (
        <Badge
          variant="default"
          className="bg-orange-200 text-orange-800 border-none"
        >
          Reserva
        </Badge>
      );
  }
};

export { getActionBadge, getEntityBadge, getStatusBadge };
