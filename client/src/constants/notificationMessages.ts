const SUCCESS = {
  LOGIN: {
    TITLE: "Login realizado com sucesso! 🎉",
    DESCRIPTION:
      "Seja bem-vindo(a) de volta! Você está conectado(a) e pronto(a) para utilizar o sistema.",
  },
  LOGOUT: {
    TITLE: "Logout realizado com sucesso! 🎉",
    DESCRIPTION:
      "Você foi desconectado(a) do sistema. Esperamos vê-lo(a) novamente em breve!",
  },
  BOOKING: {
    CREATE_TITLE: "Reserva criada com sucesso! 🎉",
    CREATE_DESCRIPTION:
      "Sua reserva foi concluída com sucesso. Confira os detalhes registrados. A sala estará disponível no horário selecionado.",
    CANCEL_TITLE: "Reserva cancelada com sucesso! 🎉",
    CANCEL_DESCRIPTION:
      "Sua reserva foi cancelada com sucesso. O horário da sala agora está disponível para outras reservas.",
    UPDATE_TITLE: "Reserva atualizada com sucesso! 🎉",
    UPDATE_DESCRIPTION:
      "Os detalhes da sua reserva foram atualizados com sucesso. Confira as informações revisadas para garantir que tudo está correto.",
  },
  ROOM: {
    CREATE_TITLE: "Sala criada com sucesso! 🎉",
    CREATE_DESCRIPTION:
      "A sala foi cadastrada no sistema com sucesso. Ela já está disponível para reservas.",
    DELETE_TITLE: "Sala deletada com sucesso! 🎉",
    DELETE_DESCRIPTION:
      "A sala foi removida do sistema com sucesso. Todas as reservas associadas a ela foram canceladas.",
  },
  RESOURCE: {
    CREATE_TITLE: "Recurso criado com sucesso! 🎉",
    CREATE_DESCRIPTION:
      "O recurso foi cadastrado na sala com sucesso. Ele já está disponível para uso nas reservas associadas a essa sala.",
    DELETE_TITLE: "Recurso deletado com sucesso! 🎉",
    DELETE_DESCRIPTION:
      "O recurso foi removido da sala com sucesso. Ele não estará mais disponível para uso nas reservas associadas a essa sala.",
  },
  USER: {
    CREATE_TITLE: "Usuário criado com sucesso! 🎉",
    CREATE_DESCRIPTION:
      "O usuário foi criado no sistema com sucesso. Ele já pode acessar sua conta e utilizar os recursos disponíveis.",
    DELETE_TITLE: "Usuário deletado com sucesso! 🎉",
    DELETE_DESCRIPTION:
      "O usuário foi removido do sistema com sucesso. Ele não poderá mais acessar sua conta e utilizar os recursos disponíveis.",
  },
};

const ERROR = {
  LOGIN: {
    TITLE: "Erro ao fazer login! ⚠️",
    DESCRIPTION:
      "Houve um erro ao tentar fazer login. Por favor, verifique suas credenciais e tente novamente.",
  },
  BOOKING: {
    CREATE_TITLE: "Erro ao criar reserva! ❌",
    CREATE_DESCRIPTION:
      "Houve um erro ao tentar criar a reserva. Por favor, tente novamente mais tarde.",
    NOT_FOUND_TITLE: "Reserva não encontrada! 🔍",
    NOT_FOUND_DESCRIPTION:
      "A reserva que você está tentando acessar não foi encontrada. Por favor, verifique os dados e tente novamente.",
    UNAUTHORIZED_TITLE: "Ação não autorizada! 🔒",
    UNAUTHORIZED_DESCRIPTION:
      "Você não tem permissão para cancelar esta reserva. Apenas o usuário que a criou pode cancelá-la.",
    ALREADY_CANCELLED_TITLE: "Reserva já cancelada! 🗑️",
    ALREADY_CANCELLED_DESCRIPTION:
      "Esta reserva já foi cancelada anteriormente. Não é possível realizar esta ação novamente.",
    PAST_DATE_TITLE: "Impossível cancelar a reserva! ⏳",
    PAST_DATE_DESCRIPTION:
      "Não é possível cancelar reservas de datas que já passaram.",
    CANNOT_CANCEL_TITLE: "Cancelamento não permitido! 🚫",
    CANNOT_CANCEL_DESCRIPTION:
      "Esta reserva não pode ser cancelada devido ao seu status atual.",
    CONFLICT_TITLE: "Conflito de reservas! ⚠️",
    CONFLICT_DESCRIPTION:
      "Não foi possível criar a reserva, pois já existe outra reserva para o mesmo horário e local. Por favor, escolha outro horário ou sala.",
  },
  ROOM: {
    CREATE_TITLE: "Erro ao criar sala! ⚠️",
    CREATE_DESCRIPTION:
      "Houve um erro ao tentar criar a sala. Por favor, tente novamente mais tarde.",
  },
  RESOURCE: {
    CREATE_TITLE: "Erro ao criar recurso! ⚠️",
    CREATE_DESCRIPTION:
      "Houve um erro ao tentar criar o recurso. Por favor, tente novamente mais tarde.",
    DELETE_TITLE: "Erro ao deletar recurso! ❌",
    DELETE_DESCRIPTION:
      "Houve um erro ao tentar deletar o recurso. Por favor, tente novamente mais tarde.",
  },
  USER: {
    CREATE_TITLE: "Erro ao criar usuário! ⚠️",
    CREATE_DESCRIPTION:
      "Houve um erro ao tentar criar o usuário. Por favor, tente novamente mais tarde.",
    DELETE_TITLE: "Erro ao deletar usuário! ❌",
    DELETE_DESCRIPTION:
      "Houve um erro ao tentar deletar o usuário. Por favor, tente novamente mais tarde.",
  },
  ROLE: {
    TITLE: "Erro ao buscar cargos! 🔍",
    DESCRIPTION:
      "Houve um erro ao tentar carregar os cargos. Por favor, tente novamente mais tarde.",
  },
};

export { ERROR, SUCCESS };
