import { FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import { MainGrid } from '../src/components/MainGrid';
import { Box } from '../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';

type ProfileSidebarProps = {
  githubUser: String;
};

function ProfileSidebar({ githubUser }: ProfileSidebarProps) {
  return (
    <Box>
      <img
        src={`https://github.com/${githubUser}.png`}
        alt=''
        style={{ borderRadius: '8px' }}
      />
      <hr />

      <p>
        <a className='boxLink' href={`https://github.com/${githubUser}.png`}>
          @{githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

type Seguidores = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

type ProfileRelationsBoxProps = {
  title: string;
  seguidores: Seguidores[];
};

function ProfileRelationsBox({ title, seguidores }: ProfileRelationsBoxProps) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {title} ({seguidores.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

type Comunidade = {
  title: string | FormDataEntryValue | null;
  imageUrl: string | FormDataEntryValue | null;
  creatorSlug: string;
};

type HomeProps = {
  githubUser: string;
};

export default function Home({ githubUser }: HomeProps) {
  const usuarioAleatorio = githubUser;
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];

  const [seguidores, setSeguidores] = useState<Seguidores[]>([]);

  // 0 - Pegar o array de dados do github
  useEffect(() => {
    fetch('https://api.github.com/users/peas/followers')
      .then((respostaDoServidor) => respostaDoServidor.json())
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: '38cca18aa14e166863340a60cd2d26',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }`,
      }),
    })
      .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        // console.log(comunidadesVindasDoDato);
        setComunidades(comunidadesVindasDoDato);
      });
    // .then(function (response) {
    //   return response.json()
    // })
  }, []);

  // console.log('seguidores antes do return', seguidores);

  // 1 - Criar um box que vai ter um map, baseado nos items do array
  // que pegamos do GitHub

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className='profileArea' style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className='welcomeArea' style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className='title'>Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className='subTitle'>O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(event: FormEvent) {
                event.preventDefault();
                const dadosDoForm = new FormData(
                  event.currentTarget as HTMLFormElement
                );

                // console.log('Campo: ', dadosDoForm.get('title'));
                // console.log('Campo: ', dadosDoForm.get('image'));

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: usuarioAleatorio,
                };

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();
                  // console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });

                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              }}
            >
              <div>
                <input
                  placeholder='Qual vai ser o nome da sua comunidade?'
                  name='title'
                  aria-label='Qual vai ser o nome da sua comunidade?'
                  type='text'
                />
              </div>
              <div>
                <input
                  placeholder='Coloque uma URL para usarmos de capa'
                  name='image'
                  aria-label='Coloque uma URL para usarmos de capa'
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className='profileRelationsArea'
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title='Seguidores' seguidores={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((itemAtual, index) => {
                return (
                  <li key={index}>
                    <a href={`/comunities/${itemAtual.title}`}>
                      <img src={itemAtual.imageUrl?.toString()} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

type DecodeToken = {
  githubUser: string;
  roles: string[];
  iat: number;
  exp: number;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;

  // Parte original (errada)
  // const { isAuthenticated } = await fetch(
  //   'https://alurakut.vercel.app/api/auth',
  //   {
  //     headers: {
  //       Authorization: token,
  //     },
  //   }
  // ).then((resposta) => resposta.json()); // Versão oficial (está com erro)

  // if (!isAuthenticated) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }

  const { githubUser } = jwt.decode(token) as DecodeToken;

  //********************************
  // Parte feita para "arrumar" o erro da original
  const existingUser = await fetch(`https://github.com/${githubUser}`).then(
    async (response) => (response.status === 404 ? false : true)
  );

  if (!existingUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  //********************************

  return {
    props: {
      githubUser,
    }, // will be passed to the page component as props
  };
};
