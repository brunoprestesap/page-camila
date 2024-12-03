import Image from "next/image";

const page = () => {
  return (
    <div id="privacidade" className="relative w-full">
      <Image
        className="w-full h-screen object-cover object-top"
        width={3232}
        height={4774}
        src="/assets/brand.jpg"
        alt="brand background"
      />

      <div className="w-full h-screen absolute top-0 left-0 md:bottom-4 bg-white/50">
        <div
          id="politica"
          className="flex justify-center absolute bottom-10 left-0 md:w-5/6 lg:max-w-[1000px] px-5"
        >
          <div className="backdrop-opacity-10 rounded-2xl bg-white px-5 py-8 bg-opacity-60 shadow-2xl shadow-stone-500/50">
            <div className="flex gap-2">
              <h2 className="text-2xl md:text-4xl tracking-widest text-[#CDBCA8] font-extrabold">
                POLÍTICA DE
              </h2>
              <h2 className="text-2xl md:text-4xl font-bold mb-5 underline decoration-[#7C5A12] underline-offset-8">
                PRIVACIDADE
              </h2>
            </div>
            <div className="my-3">
              <h3 className="font-bold text-lg">Objetivo</h3>
              <p className="text-sm">
                Esta política de privacidade estabelece como a Dra. Camila
                Neiva, através do site dracamilaneiva.com.br, coleta, utiliza e
                protege as informações pessoais dos usuários que visitam o site.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">Coleta de Informações</h3>
              <p className="text-sm">
                Coletamos informações pessoais, como nome, e-mail e telefone,
                apenas quando fornecidas voluntariamente pelos usuários, por
                exemplo, ao preencher um formulário de contato ou agendar uma
                consulta.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">Uso das Informações</h3>
              <p className="text-sm">
                As informações coletadas são usadas exclusivamente para
                comunicação com os usuários, confirmação de consultas e envio de
                informações relevantes sobre serviços médicos. Não utilizamos
                dados para fins comerciais ou de marketing sem o consentimento
                expresso do usuário.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">
                Compartilhamento de Informações
              </h3>
              <p className="text-sm">
                Não compartilhamos informações pessoais com terceiros, exceto
                para cumprir com obrigações legais ou para processamento interno
                de serviços solicitados pelo usuário.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">Segurança das Informações</h3>
              <p className="text-sm">
                Implementamos medidas de segurança para proteger as informações
                pessoais coletadas contra acesso não autorizado e divulgação não
                autorizada.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">Direitos do Usuário</h3>
              <p className="text-sm">
                Os usuários têm o direito de acessar, corrigir e solicitar a
                exclusão de suas informações pessoais. Podem também retirar o
                consentimento para o uso de seus dados a qualquer momento.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">Retenção de Dados</h3>
              <p className="text-sm">
                Mantemos as informações pessoais apenas pelo tempo necessário
                para atender às finalidades para as quais foram coletadas.
              </p>
            </div>

            <div className="my-3">
              <h3 className="font-bold text-lg">
                Alterações na Política de Privacidade
              </h3>
              <p className="text-sm">
                Reservamo-nos o direito de alterar esta política de privacidade
                a qualquer momento. As mudanças serão publicadas nesta página.
              </p>
            </div>

            <h3 className="font-bold text-lg">Contato</h3>
            <p className="text-sm">
              Para dúvidas ou solicitações relacionadas a esta política de
              privacidade, entre em contato pelo e-mail
              [clinicadracamilaneiva@gmail.com]. Encarregado de Proteção de
              Dados O contato com o Encarregado de Proteção de Dados pode ser
              feito através do e-mail [clinicadracamilaneiva@gmail.com].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
