import { FormEvent, useEffect, useState } from 'react';

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

function ProfileRelationsBox(propriedades: any) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {propriedades.title} ({propriedades.items.length})
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
  // id: string;
  title: string | FormDataEntryValue | null;
  imageUrl: string | FormDataEntryValue | null;
  creatorSlug: string;
};

export default function Home() {
  const usuarioAleatorio = 'rafarod21';
  // const [comunidades, setComunidades] = useState<Comunidade[]>([
  //   {
  //     id: '12802378123789378912789789123896123',
  //     title: 'Eu odeio acordar cedo',
  //     imageUrl: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  //     creatorSlug: 'rafarod21'
  //   },
  // ]);
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  // const comunidades = comunidades[0];
  // const alteradorDeComunidades/setComunidades = comunidades[1];

  // const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];

  const [seguidores, setSeguidores] = useState<any>([]);

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
          <ProfileRelationsBox title='Seguidores' items={seguidores} />
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
