# Análise técnica e validação do MQT Custo/Venda
**Obra:** Pavilhão gimnodesportivo escolar (novo edifício com ginásio e sala de ginástica, demolição do pavilhão existente, arranjos exteriores)
**Documento analisado:** `MQT_CUSTO-VENDA.XLS` (1 folha, 833 artigos com quantidade, 14 capítulos; último registo de gravação: 28-09-2026)
**Data da análise:** 09-10-2026
> **Revisão de 09-10-2026:** os achados foram depois revistos por grupo de capítulos e verificados por um segundo analista independente. O resultado está no **`MAPA_COMPARATIVO_FALHAS_ERROS.xlsx`** (202 achados confirmados e 9 rejeitados), que **substitui as estimativas da secção 9**: impacto líquido entre **+116 k€ e +400 k€**. Três pontos deste relatório foram retirados nessa verificação: a designação "Dinf" (é válida na NP EN 206), a medição de cabo de iluminação (o rácio é normal) e a duplicação 4.4.1 ↔ 11.4.2 (são circuitos diferentes).

**Ficheiros que acompanham este relatório:** `MQT_CUSTO-VENDA_ANOTADO.xlsx` (o MQT original com 3 colunas novas em cada artigo: classificação, gravidade e observação/ação; inclui também as folhas RESUMO, IMPACTO ESTIMADO e VERIF. ARITMÉTICA)

---

## 0. Pressupostos e âmbito

- Tudo no MQT aponta para **Portugal**: preços em euros, legislação portuguesa (DL 273/2003, DR 22-A/98, PPGRCD, RT-SCIE), normas NP/EN/LNEC, entidades (Entidade Gestora, E-Redes) e marcas do mercado português (Secil, CIN, Sanindusa, OFA, JNF, Navarra, TRIA, ACL). A análise parte desse pressuposto.
  > Se o MQT for usado noutro país (por exemplo Moçambique), **não é aplicável sem ser refeito**: moeda, regulamentos de contratação e de segurança contra incêndio, normas, cadeia de fornecimento e preços unitários teriam de ser todos revistos.
- Analisei **o MQT em si**: coerência interna, aritmética, descrições, normas citadas, omissões técnicas típicas deste tipo de obra e preços face a referências de mercado. **Não recebi peças desenhadas, caderno de encargos nem memórias descritivas.** Por isso as medições não foram verificadas contra desenhos. Os pontos marcados "a confirmar" precisam dessa verificação.
- Os valores de mercado indicados são **ordens de grandeza** (Portugal, 2025–2026, sem IVA). Não substituem consultas a subempreiteiros e fornecedores.

---

## 1. Parecer

> ### ❌ NÃO VALIDAR na versão atual
> O MQT tem uma boa estrutura de capítulos e descrições detalhadas na construção civil, mas apresenta **um erro de base que invalida a "VENDA"**, **duplicações**, **omissões relevantes**, **preços fora de mercado** (para cima e para baixo) e **especialidades sem descrição técnica**.
> Só deve ser validado depois de corrigidos os pontos **CRÍTICOS** e **ALTOS** (secções 3 a 8) e de feita uma conferência das medições com as peças desenhadas.

**Os 10 problemas mais graves:**

| # | Problema | Impacto |
|---|---|---|
| 1 | **VENDA = CUSTO.** Os 833 preços unitários de venda são iguais aos de custo. K implícito = 1,0000 e a venda fica **12,12 € abaixo do custo**. | Proposta sem estrutura, risco nem lucro |
| 2 | **14.4.4**: cabo LIHCH 6x2x0,75 a **120,76 €/m** (referência ~2–3,5 €/m) | +~13 k€ indevidos |
| 3 | **2.2.2 / 2.3.3**: maciços de encabeçamento medidos duas vezes (63,00 m³ e 63,11 m³, mesma descrição) | ~20 k€ duplicados |
| 4 | **3.1.2 Amianto**: sem transporte e destino licenciado, sem plano de trabalhos aprovado pela ACT (DL 266/2007), área provavelmente subestimada, preço abaixo do mercado | Risco legal e de custo |
| 5 | **Equipamento desportivo inexistente** num pavilhão gimnodesportivo (balizas, tabelas, postes, proteções…) | 35–70 k€ em falta |
| 6 | **Contenção ancorada**: só 2 ensaios para 13 ancoragens, monitorização a 3.500 €, sem desmontagem de escoras nem destensionamento | Risco técnico (EN 1537) |
| 7 | **Ficheiro sem fórmulas**. Totais colados como valores; em 82 artigos o total de custo ≠ Q×PU; sem total geral nem IVA | Sem rastreabilidade |
| 8 | **Elétrica, ITED, SCIE e GTC** com artigos de uma palavra ("Q.G.P.", "Tipo L1", "Inversor Solar") | Impossível validar preço ou conformidade |
| 9 | **Omissões**: rede de rega, linha de vida, SPDA, ensaios de carga de microestacas, sonorização, Wi-Fi/ativos, certificações | 110–275 k€ em falta |
| 10 | **Preços irrealistas**: valas com entivação a 5,5 €/m³, geodrenos a 3,56–10,60 €/m, demolição de muros a 6,5 €/m³, CV especial D400 a 545 €, poste de 12 m a 570 € | 95–225 k€ subavaliados |

---

## 2. Resumo financeiro do MQT

| Cap. | Designação | Custo (€) | % |
|---|---|---:|---:|
| 1 | Trabalhos preparatórios | 312 435,00 | 6,94 % |
| 2 | Estabilidade | 1 651 924,53 | 36,71 % |
| 3 | Arquitetura | 1 586 732,18 | 35,26 % |
| 4 | Rede de abastecimento de água | 78 339,70 | 1,74 % |
| 5 | Drenagem de águas residuais | 40 966,31 | 0,91 % |
| 6 | Drenagem de águas pluviais | 128 757,01 | 2,86 % |
| 7 | Instalações elétricas | 265 980,37 | 5,91 % |
| 8 | Telecomunicações | 9 863,68 | 0,22 % |
| 9 | Segurança contra incêndio (passiva) | 2 885,06 | 0,06 % |
| 10 | Segurança ativa | 17 332,79 | 0,39 % |
| 11 | AVAC | 271 944,75 | 6,04 % |
| 12 | Eletromecânicas (ascensor) | 31 350,00 | 0,70 % |
| 13 | Arquitetura paisagista | 65 465,00 | 1,45 % |
| 14 | Gestão técnica centralizada | 35 665,70 | 0,79 % |
| | **TOTAL CUSTO (s/ IVA)** | **4 499 642,08** | 100 % |
| | **TOTAL VENDA (s/ IVA)** | **4 499 629,96** | K = 0,999997 |

**Leitura de engenheiro:**
- **Estaleiro (1.1) = 5,9 %**, dentro do intervalo habitual (3–7 %).
- **Estrutura = 36,7 %** é elevado, mas explica-se pela contenção periférica ancorada e pelas microestacas (cerca de 1/3 do capítulo 2).
- **Instalações especiais (caps. 4 a 14) ≈ 19,6 %** está no limite inferior para um edifício escolar-desportivo com AVAC, AQS por bomba de calor, desenfumagem e fotovoltaico. **SCIE passiva (0,06 %) e Telecomunicações (0,22 %) são anormalmente baixas**, sinal de omissões.
- **Rácios estruturais calculados:** betão armado ≈ 1 383 m³ (caps. 2.2–2.6); aço de contenção ≈ 12,5 t (2,94–3,12 €/kg); aço estrutural ≈ 8,5 t (3,11 €/kg); madeira lamelada ≈ **133,5 m³ a uma média de 2 314 €/m³**.

---

## 3. Erros estruturais do próprio ficheiro

| Ref. | Constatação | Gravidade | Ação |
|---|---|---|---|
| Colunas G/H | **PU de venda = PU de custo em todos os artigos.** Não há coeficiente K (estrutura, risco, lucro). | CRÍTICA | Definir K (tipicamente 1,15–1,25 conforme a empresa) ou construir o preço de venda por artigo |
| Todo o ficheiro | **Não tem nenhuma fórmula.** Somas e totais são valores colados. Alterar uma quantidade não atualiza nada. | ALTA | Refazer com fórmulas Q×PU e SUBTOTAL por capítulo |
| Coluna F | Em **82 artigos** o total de custo ≠ Q×PU (até 6,35 €). Os PU de custo tinham mais casas decimais noutro ficheiro. Por isso a venda fica abaixo do custo em 49 artigos. | MÉDIA | Arredondar o PU primeiro e só depois multiplicar |
| Fim do MQT | **Sem total geral, sem resumo por capítulos, sem linha de IVA**, sem indicação "IVA não incluído" nem taxa aplicável | ALTA | Acrescentar quadro-resumo |
| 11.14 | Subtotal de 28 201,65 € contra soma real de 24 260,22 €: inclui indevidamente 11.15–11.17 (3 × 1 313,81 €). O total do capítulo 11 está certo. | MÉDIA | Corrigir o subtotal |
| 102.2.1 | Numeração errada (devia ser 10.2.2.1); o artigo fica fora da hierarquia | MÉDIA | Renumerar |
| 11.10.4.10.x | Deviam ser 11.10.10.x. 11.10.5 repete o título "Grelha de Retorno". 11.10.6.1 e 11.10.6.2 estão ambos como "RA2". | BAIXA | Renumerar/corrigir |
| 7.6.1.6 / 7.6.2 | Título "Tubagem" num nível, itens noutro | BAIXA | Renumerar |
| Unidades | 11.14.2.x e 11.14.3.x (cabos e tubos) em **UN** em vez de **m**; 11.13.6.1 (coletor) em **m** a 1 897,94 €/m em vez de **UN** | MÉDIA | Corrigir unidades |
| Quantidades | **121 de 236** quantidades da Arquitetura são números redondos (9 000 m³, 1 000 m², 2 500 m³, 1 550 m², 850 m²…). Na Estabilidade são só 3 de 69. | MÉDIA | Pedir medições com memória de cálculo |
| Ortografia | "Paredes Exterioes", "Sememteiras", "Betoneiras de Emergência", "Descalsificação", "Modubus", "Gimanodesportivo", "betuiminosa", "atravessamentyo", "RECSOUND"… | BAIXA | Revisão de texto (documento contratual) |

---

## 4. Duplicações e sobreposições

| Artigos | Descrição | € em causa | Confiança |
|---|---|---:|---|
| **2.2.2 ↔ 2.3.3** | Maciços de encabeçamento com a mesma descrição: 63,00 m³ e 63,11 m³ | 19 996 | Alta |
| **6.2.18 ↔ 3.3.1/3.3.2/3.3.5 + nota 02** | Caleiras de cobertura pagas nos artigos de cobertura ("caleira de drenagem de A.P.s… tipo FTB") e de novo em zinco nº 12 (196,6 m) | 7 864 | Alta |
| **3.16.1.18 ↔ 5.3.7** | Drenagem linear dos duches: ACO inox 28 ml e "canal com grelha chuveiros" 25,6 m (que refere "cozinhas", inexistentes) | 5 632 | Alta |
| **7.1.2.2 ↔ 7.2.8.4.1** | PEAD Ø110 com 155 m, mesma quantidade e preço | 699 | Alta |
| **3.16.1.3/3.16.1.4 ↔ 5.3.1/5.3.2** | Sifões incluídos nos lavatórios e urinóis e medidos outra vez (e 7 sifões para 6 urinóis) | ~910 | Alta |
| **3.11.2.19 ↔ 10.1.9** | Retentores eletromagnéticos GEZE incluídos nas portas CF (3) e medidos na SADI (2) | 155 | Alta |
| **10.5.1 ↔ 7.10** | O texto de 10.5.1 diz que tubagens e caixas de segurança são "executadas pela empreitada de instalações elétricas", mas são valorizadas nos dois capítulos | 514–1 632 | Média |
| **4.3.6/4.3.8 ↔ 11.2.1/11.3.3** | Válvula antipoluição e grupos de segurança de AQS nas duas especialidades | 0–678 | Média |
| **1.1 ↔ 1.2** | "Plano de Qualidade, Planeamento e Gestão de Obra" incluído no estaleiro e de novo em 1.2 | — | Média |
| **2.1.1 ↔ 2.1.5** | A escavação inclui "carga e transporte" e o transporte a vazadouro volta a pagar "carga, transporte" | — | Média (clarificar) |
| **2.6.1 / 2.6.6 / 3.4.2 / 3.4.4** | Impermeabilização e isolamento do tardoz de muros em 4 artigos e 2 capítulos (2 017 + 1 086 + 637 + 464 m²). 2.6.6 já inclui "XPS onde necessário" | — | Média (pedir mapa de superfícies) |
| **2.6.3 ↔ 3.9.1.2** | Endurecedor de quartzo em 419,56 m² (= área do P.T.1) e Unipiso no piso 01 | — | A confirmar |
| **2.6.4.3 ↔ 3.9.1.5 / 3.9.2.2** | Degraus de bancada: 92 + 14 + 6 | — | A confirmar |
| **3.10.5 ↔ 3.5.1 / 3.6.1** | O teto exterior inclui chapa ondulada, subestrutura e painel sandwich 80 mm | — | A confirmar |

**Total de duplicações prováveis: ≈ 36–39 k€.**

---

## 5. Omissões (o que falta no MQT)

| # | Omissão | Porque é necessária | Ordem de grandeza (€) |
|---|---|---|---:|
| 1 | **Equipamento desportivo**: balizas de andebol/futsal, tabelas de basquetebol, postes e redes de voleibol/badminton com casquilhos no soalho, espaldares, colchões, marcador, proteções acolchoadas | Sem isto o pavilhão não funciona como gimnodesportivo | 35 000–70 000 |
| 2 | **Rede de rega** (gota-a-gota/aspersão, programador, eletroválvulas, sensor de chuva) | Há contador e ramal de rega (4.3.10/4.5.2) e ~3 550 m² plantados, mas nenhuma rede | 20 000–35 000 |
| 3 | **Linha de vida / sistema anti-queda na cobertura** (EN 795) | Manutenção de ~1 900 m² de cobertura, 16 exutores e 192 painéis FV | 8 000–18 000 |
| 4 | **SPDA / para-raios** e análise de risco (EN 62305) | Edifício de grande volume com fotovoltaico na cobertura | 8 000–20 000 |
| 5 | **Ensaios de carga de microestacas** e controlo de qualidade (provetes de betão, aço, compactação) | 1 680 ml de microestacas sem qualquer ensaio | 8 000–18 000 |
| 6 | **Ensaios de receção de todas as ancoragens** (só 2 previstos), **destensionamento/desativação** das provisórias, **desmontagem das escoras** | EN 1537 / EN ISO 22477-5; o LNEC documenta roturas diferidas de sistemas ancorados não ensaiados | 5 000–10 000 |
| 7 | **Proteções anti-impacto de bola** em luminárias, detetores, sinalizadores e paredes até ~2 m | Pavilhão desportivo (só os blocos S2 têm grelha) | 6 000–20 000 |
| 8 | **Sonorização do pavilhão** | Uso escolar/eventos e eventual difusão de mensagens | 6 000–15 000 |
| 9 | **Alimentações elétricas dedicadas**: 16 secadores de mãos (~1,5–2,5 kW cada), estores motorizados, cortina CF, bancada retrátil, 2.ª central de desenfumagem, ascensor, resistências de AQS | Não aparecem no cap. 7 (só 31 "caixas terminais") | 5 000–15 000 |
| 10 | **Ativos de rede e Wi-Fi** | O próprio 8.3 diz "com espaço para equipamentos ativos", mas não os inclui | 5 000–12 000 |
| 11 | **Certificações e licenciamentos**: instalação elétrica (entidade inspetora), ITED, certificado energético SCE, ensaios acústicos (RRAE, exigidos em edifícios escolares), inspeção do ascensor (EIL), registo da UPAC (DL 15/2022), eventual aumento de potência (E-Redes) | Necessários para receção e licença de utilização | 6 000–12 000 |
| 12 | **Marcações de jogo do campo exterior** (PAV E 02, 2 538 m²) | Só as interiores estão medidas (3.15.9) | 1 500–4 000 |
| 13 | **Plantas de emergência** e extintores CO₂ junto a cada quadro elétrico/sala técnica | Só 1 CO₂ para QGP, QPPav, QPCIG, QPV.AC, QEAC e inversores | 1 000–2 500 |
| 14 | **Compilação técnica da obra** (DL 273/2003, art. 16.º) | Obrigatória | 1 500–3 000 |
| 15 | **Garantia/manutenção das plantações** (1.º ano) | Caderno de encargos de paisagismo | 3 000–6 000 |
| 16 | **Vãos VE.C.01 (8) e VE.1.11 (8)**: têm soleira (3.11.2.26), mas não têm artigo de caixilharia | Possível omissão de 16 vãos (verificar no mapa de vãos) | 0–24 000 |
| 17 | **Transporte a vazadouro dos 2 500 m³ de 3.2.1** | Excedente sem destino | incl. em C |
| 18 | **Condicionais (dependem do estudo geotécnico)**: escavação em rocha, rebaixamento freático/bombagem durante a escavação ancorada | 9 862 m³ "em terreno de qualquer natureza" a 5,5 €/m³ | não orçamentado |

**Total de omissões: ≈ 114–275 k€** (sem os condicionais).

---

## 6. Preços fora de mercado

### 6.1 Abaixo do mercado (risco de prejuízo em obra)

| Artigo | No MQT | Referência de mercado | Comentário |
|---|---:|---:|---|
| 1.2 Faseamento c/ pavilhão em funcionamento | 2 000 € | 10–25 k€ | Duas fases, acessos provisórios, proteção de alunos |
| 2.2.13 Monitorização | 3 500 € | 10–20 k€ | Plano, alvos topográficos, inclinómetros, vistorias e leituras durante meses |
| 2.4.2 Aço interior c/ C3 + intumescente R60 | 2,84–3,13 €/kg | ≥ 4,2–5,5 €/kg | O intumescente R60 em secções pequenas custa por si ~1,2–2,3 €/kg |
| 3.1.2 Remoção de amianto | 14 €/m² | ~20 €/m² com transporte (mercado particular); 20–30 €/m² em obra pública com plano e medições | Falta transporte e deposição licenciada |
| 3.1.4 Demolição manual de muros BA/granito c/ transporte | **6,5 €/m³** | 45–80 €/m³ | Irrealista |
| 4.1.1 / 5.1.1 / 6.1.1 Valas c/ entivação (estacas-prancha/painéis) | **5,5 €/m³** | 12–18 €/m³ | 1 196 m³ no total |
| 6.2.8 / 6.2.9 Geodreno c/ brita, geotêxtil, vala e reposição de pavimento | **3,56–10,60 €/m** | 22–35 €/m | O próprio 2.6.5 (sem vala) custa 20,32 €/m |
| 6.2.13 CV especial (caixa BA 1,5×1,5, D400, C35/45) | 545,62 € | 2,5–5 k€ | — |
| 5.3.6.1 CV DN1000 até 2,5 m c/ escavação | 520,82 € | 900–1 500 € | Mesmo preço da CV de 1,0–1,5 m |
| 7.4.1 QGP para entrada 4×185 mm² | 2 648,86 € | 8–13 k€ | — |
| 7.7.3.1.9 Poste de 12 m | 570,65 € | 1,5–3 k€ c/ maciço | Maciço não incluído |
| 10.1.1 Central de deteção de incêndio | 636,07 € | 1,5–4 k€ (endereçável) | — |
| 3.16.1.14 Kit de barras mob. condicionada | 62,10 € | 250–500 € | DL 163/2006 |
| 13.3.x Árvore PAP 16/18, 4–4,5 m, cova 1,5×1,2 m | 110–150 € | 250–450 € | — |
| 4.5.1 Ramal de ligação | 750 € | 1,5–3 k€ + taxas | Taxas da entidade gestora não incluídas |
| 7.12, 7.13, 10.5.2, 10.5.3, 12.2, 5.4.5, 6.3.4 Ensaios/telas | 100–600 € | — | Valores simbólicos |

### 6.2 Acima do mercado (margem de negociação ou erro)

| Artigo | No MQT | Referência | Comentário |
|---|---:|---:|---|
| **14.4.4 LIHCH 6x2x0,75** | **120,76 €/m** | 2–3,5 €/m | Erro óbvio, **~13 k€** |
| 2.5.1 Madeira lamelada GL24h | média **2 314 €/m³** | Material ~900–1 300 €/m³ (retalho, c/ IVA); fornecido e montado c/ ligações ~1 500–2 200 €/m³ | ~10–30 k€ de margem a negociar |
| 11.13.6.1 Coletor | 1 897,94 €/**m** | — | Unidade errada (é UN) |
| 4.2.1.7 / 4.2.2.8 Multicamada DN90 | 178,38 €/m | — | Ponderar PP-R, PEAD ou inox neste diâmetro |

### 6.3 Incoerências de preço dentro do próprio MQT

| Artigos | Constatação |
|---|---|
| 2.2.1 ↔ 2.3.1.1 | **Mesma microestaca** (N80 101,6×6,5, IRS) a 90,03 €/ml e 134,17 €/ml (+49 %) |
| 2.2.5 ↔ 2.3.1.2 | Tubo 88,9×6,5 a 74,57 €/ml e 126,31 €/ml (+69 %) |
| 2.5.1.8 | PM 0,20×0,20 ao preço da VM 0,15×0,20 (1 743 €/m³ contra ~2 330 €/m³ nas restantes peças) |
| 2.4.2.1 ↔ 2.4.2.2/4 | No mesmo artigo, IPE80 a 6,94 €/kg e LNP/SHS a 2,84–3,13 €/kg |
| 3.8.5 ↔ 3.10.2 | Mesma descrição ("de paredes") a 61,51 e 96,58 €/m² |
| 3.9.1.2 ↔ 3.9.2.5 | Unipiso interior 10 cm (35 €/m²) **mais caro** que exterior 12 cm + 20 cm brita + manta (34,13 €/m²) |
| 3.13.4 ↔ 3.13.5 | Mesma descrição a 145 €/ml e 60 €/ml |
| 6.2.5.6 ↔ 6.2.5.7 | PVC DN400 (45,24 €/m) **mais barato** que DN315 (63,38 €/m) |
| 6.2.11.3 ↔ 6.2.11.4 | Caixa 1,00×1,00 H=2,80 m ao preço da 0,80×0,80 |
| 5.3.6.1 ↔ 6.2.12.1/2 | CV DN1000 de 1,4–2,5 m ao preço da CV de 1,0–1,5 m |
| 11.15 / 11.16 / 11.17 / 7.1.1 / 7.3.7.1 | Cinco VG com o mesmo valor (1 313,81 €) e sem conteúdo: preço "de enchimento" |

---

## 7. Análise por capítulo (detalhe técnico)

### Cap. 1 – Trabalhos preparatórios
- **1.1**: o estaleiro inclui andaimes; confirmar alturas (pavilhão até ~10 m), plataformas elevatórias para cobertura e fachada e redes de proteção.
- **1.2**: o faseamento descrito (manter o pavilhão existente a funcionar, acesso confortável e seguro à escola) é dos trabalhos mais exigentes desta obra e está **orçado em 2 000 €**.
- **1.7 "Desativações"**: VG sem âmbito, sobreposto a 3.1.3.

### Cap. 2 – Estabilidade
- **Movimento de terras:** o balanço bate certo (escavação 9 861,90 + 698,28 − aterro 2 388,61 = transporte 8 171,57 m³), mas **sem empolamento**. Confirmar o critério de medição (volume no perfil ou solto). 5,5 €/m³ para 20 km com taxa de deposição é baixo. Não há artigo para **rocha** nem para **esgoto/rebaixamento de água**.
- **Contenção periférica:**
  - 2.2.3/2.2.4: descrições **tecnicamente impossíveis** (leitada "pelo interior da armadura" num perfil HEA/HEB). Faltam comprimento, furação e selagem.
  - 2.2.9: "ME-1" é a classe visual do **pinho bravo** (NP 4305), não do eucalipto.
  - 2.2.10: as **escoras provisórias** não têm desmontagem.
  - 2.2.12: **"ensaio de 2 ancoragens"**. A EN 1537 (ensaios pela EN ISO 22477-5) prevê **ensaio de receção em todas** as ancoragens, além dos ensaios de aptidão. O LNEC documenta colapsos de sistemas ancorados cerca de 5 anos após a obra, ligados à falta de ensaio e inspeção. Faltam também a **desativação das ancoragens provisórias** e a **autorização dos proprietários vizinhos** se os bolbos entrarem no terreno deles.
  - 2.2.13: monitorização claramente subavaliada.
- **Obra de betão:**
  - 2.3.7: classe de exposição "**XC**" incompleta. É o maior artigo de betão (172,6 k€).
  - 2.3.11 VIGAS: **sem especificação do betão**.
  - 2.3.12/2.3.13: escoramento só "até 4,0 m".
  - 2.3.14: título "15 cm" contraditório com as caixas de brita de 0,22/0,15/0,17 m.
  - Não há ensaios de carga das microestacas (1 680 ml no total).
- **Estrutura metálica:**
  - 2.4.2 inclui **intumescente R60** a preços de aço simples.
  - 2.4.4: "**0,30 m** de espessura" deve ser **0,030 m**; "ST 37.2" é designação DIN obsoleta (usar S235JR, EN 10025-2).
- **Madeira (2.5):** "Pinho silvestre ME-1; GL24h" mistura duas classificações incompatíveis (NP 4305 visual ≠ EN 14080 lamelado colado). Faltam **classe de uso/tratamento preservador** e **resistência ao fogo (R) exigida** para a estrutura de cobertura de um edifício escolar. O preço médio de 2 314 €/m³ está acima da referência.

### Cap. 3 – Arquitetura
- **Demolições:**
  - 3.1.1 não refere a demolição de fundações e lajes térreas.
  - **3.1.2 (amianto)** precisa de:
    1. levantamento prévio de materiais com amianto (pode haver amianto em caleiras, tubos e pavimentos, não só na cobertura);
    2. plano de trabalhos aprovado pela ACT, com requerimento pelo menos 30 dias antes (DL 266/2007);
    3. transporte e deposição em operador licenciado, com e-GAR (Portaria 40/2014);
    4. medições ambientais finais;
    5. área real (uma cobertura de duas águas sobre ~1 200 m² tem mais de 1 200 m², e o MQT mede 1 000 m²).
  - 3.1.4 a 6,5 €/m³ é irrealista.
- **Coberturas/fachadas:**
  - Não está especificado o **núcleo do painel sandwich** (PIR/PUR ou lã de rocha) nem a **classe de reação ao fogo**, que é exigência do RT-SCIE.
  - 3.3.2 chama "claraboia" a um painel opaco.
  - Os remates dos 16 exutores (11.11) e a **linha de vida** não aparecem.
  - **3.6.1.2: subestrutura com 320 m² para 1 550 m² de chapa ondulada.**
- **Vãos:**
  - **VE.2.14.1 "Ø45 cm" a 5 174,40 €/UN** dentro de um artigo de porta de 2 folhas: descrição e preço incompatíveis.
  - Portas e cortina CF **sem classe EI/C explicitada**.
  - **3.11.2.20 vidro E30** (só integridade): em compartimentação corta-fogo normalmente exige-se EI. Validar com o projeto SCIE.
  - VE.C.01 e VE.1.11 têm soleira mas não têm caixilharia.
- **Carpintaria/serralharia:**
  - 3.12.4 "Banco para vestiários" tem a descrição dos cacifos.
  - 3.13.4/3.13.5 "corrimão" descrito como guarda-corpos de 1,10 m. Os corrimãos de escadas/rampas ficam a 0,85–0,95 m (DL 163/2006) e os dois artigos têm preços diferentes para a mesma descrição.
- **Equipamentos sanitários:**
  - 22 torneiras para 20 lavatórios.
  - 3.16.1.17 "dispensador de sabão" descrito como "porta piaçaba".
  - Kits de mobilidade condicionada a 62 €.
  - 3.4.6: 60 m² de pavimento impermeabilizado para 32 duches parece pouco.
- **Pavimentos:**
  - Unipiso interior/exterior com preços invertidos.
  - Ginásio com 396 m² de pavimento e 380 m² de marcações.
  - O campo exterior não tem marcações nem equipamento.

### Caps. 4, 5 e 6 – Águas e drenagem
- Valas "com escoramento/entivação" a 5,5 €/m³ nos três capítulos.
- 4.3.6 refere um "**reservatório**" que não existe no MQT. Com 10 carretéis (RIA) e 2 marcos, confirmar se a rede pública garante pressão e caudal no ponto mais desfavorável. Se não garantir, faltam reservatório e grupo sobrepressor.
- 5.1.1 diz "incluindo enchimento", mas o enchimento é pago em 5.1.3.
- 5.3.7 refere "cozinhas" (não há).
- 6.2.2 refere "Ø400 série UD" em tubos de queda DN110–160.
- 6.2.13 refere tubagem de 500 mm que não existe no MQT.
- Geodrenos e caixas de visita especiais estão subavaliados.

### Cap. 7 – Instalações elétricas
- **Falta descrição técnica em quase todos os artigos.** "Q.G.P.", "Tipo L1…L5, P1…P3, E1" e "Inversor Solar" não permitem verificar nada nem exigir conformidade.
- **7.1.1**: confirmar a potência disponível no QG existente e a necessidade de **aumento de potência**.
- **Fotovoltaico (7.5)**: 192 painéis (~85–105 kWp se forem de 450–550 Wp) e 3 inversores a 1 699,55 € (preço típico de ~10–15 kW cada) dão um **rácio DC/AC incoerente**. Faltam potências, proteções DC/AC, descarregadores, registo da UPAC e verificação estrutural da cobertura (sandwich sobre madres e asnas de madeira).
- **Iluminação:**
  - As luminárias do pavilhão não têm requisito de **resistência ao impacto de bola** nem classe EN 12193.
  - Os postes de 12 m não têm maciço.
- 7.2.8.3: tampa de 400×400 para caixa de 600×600.
- 7.8.3.4: cabo USB de 10 m (USB passivo ≈ 5 m).
- **Não há SPDA.**

### Caps. 8, 9 e 10 – ITED, SCIE e segurança ativa
- Faltam ativos de rede, Wi-Fi e certificação ITED.
- Faltam plantas de emergência e há só 1 extintor CO₂.
- A CDI a 636 € é preço de central convencional pequena.
- 7 sinalizadores para pavilhão, ginásio e 2 pisos: validar audibilidade.
- Retentores duplicados.
- Câmara CCTV com numeração "102.2.1".

### Cap. 11 – AVAC
- 11.1.3/11.1.4: unidades exteriores "FBA140MY/FBA125MY" **não existem** (são os códigos das interiores).
- 11.11 Desenfumagem: a **admissão de ar** é feita por exutores de cobertura (SMOKEJET). Pelo RT-SCIE a admissão deve situar-se na zona inferior. Confirmar com o projeto.
- 11.14.4.7/8: quantidade 1 para 2 centrais.
- 11.15–11.17 são VG vazias.
- Erros de unidades e de numeração (ver secção 3).

### Caps. 12, 13 e 14
- **Ascensor:** faltam inspeção inicial, manutenção no período de garantia e trabalhos de construção civil de apoio (poço, gancho, iluminação da caixa).
- **Paisagismo:**
  - **não há rede de rega**;
  - terra vegetal a 16 €/m³ inclui, em 13.2.2, uma camada de brita de 25 cm ao mesmo preço;
  - árvores subavaliadas;
  - "P.A.P. d=16/18" mistura perímetro com diâmetro.
- **GTC:**
  - **14.4.4 a 120,76 €/m**;
  - só 3 sondas de campo;
  - não há contadores de energia.

---

## 8. Normas e legislação a rever ou explicitar

| Ref. no MQT | Situação |
|---|---|
| "NP EN 206-1" (6.2.14) | Referir a **NP EN 206:2013+A2** |
| "NP EN 124/1995" | Atualizar para **EN 124-1/-2:2015** |
| "ST 37.2" | Usar **S235JR (EN 10025-2)** |
| "ME-1 + GL24h" | Separar: NP 4305 (madeira maciça) e **EN 14080** (lamelado colado) |
| Ancoragens | Explicitar a **EN 1537** e ensaios pela **EN ISO 22477-5** |
| Amianto | Explicitar o **DL 266/2007** (plano de trabalhos ACT) e a **Portaria 40/2014** (RCD com amianto) |
| SCIE | Classes **EI/E/C** de portas, vidros e cortina; reação ao fogo dos painéis; desenfumagem (RT-SCIE) |
| Acessibilidades | Corrimãos e kits de I.S. pelo **DL 163/2006** |
| Fotovoltaico | Registo e certificação da UPAC (**DL 15/2022**) |

---

## 9. Impacto financeiro estimado

| Bloco | Mínimo (€) | Máximo (€) |
|---|---:|---:|
| A. Erro de preço certo (14.4.4) | −12 954 | −12 954 |
| B. Duplicações prováveis | −35 770 | −37 567 |
| C. Preços/quantidades subavaliados | +96 524 | +226 037 |
| D. Omissões | +114 000 | +274 500 |
| **Variação líquida do custo** | **+161 800 (+3,6 %)** | **+450 016 (+10,0 %)** |
| **Custo corrigido estimado** | **≈ 4 661 000** | **≈ 4 950 000** |

**Preço de venda (sem IVA) = custo corrigido × K**

| K | Sobre o MQT atual | Custo corrigido (mín.) | Custo corrigido (máx.) |
|---|---:|---:|---:|
| 1,15 | 5 174 588 | 5 360 658 | 5 692 107 |
| 1,20 | 5 399 570 | 5 593 731 | 5 939 590 |
| 1,25 | 5 624 553 | 5 826 803 | 6 187 073 |

> Valores de ordem de grandeza. O detalhe linha a linha está na folha **IMPACTO ESTIMADO** do Excel anotado, com fórmulas editáveis.
> **Não incluídos:** escavação em rocha, rebaixamento freático e IVA.

---

## 10. Plano de ação para validar o MQT

1. **Margem.** Aplicar um K por capítulo (estrutura + risco + lucro) e recalcular a VENDA com fórmulas. Acrescentar total geral, resumo e linha de IVA (taxa conforme o dono de obra).
2. **Ficheiro.** Refazer com fórmulas (Q×PU, SUBTOTAL). Corrigir unidades, numeração e o subtotal 11.14.
3. **Erros certos.** Corrigir 14.4.4, 2.4.4, 2.5.1.8, 3.12.4, 3.16.1.17, 11.1.3/11.1.4, 11.13.6.1 e 7.2.8.3.
4. **Duplicações.** Confirmar com as peças desenhadas e eliminar (secção 4).
5. **Medições.** Pedir a memória de medições dos artigos com quantidades redondas (sobretudo Arquitetura e 3.1/3.2) e verificar contra os desenhos os **20 artigos de maior valor**, que somam **39,3 % do custo**. Os maiores são 1.1 Estaleiro (265,2 k€), 2.3.7 Muro de suporte (172,6 k€), 3.9.2.8 PAV E 02 (127,4 k€), 2.3.12 Laje maciça (105,8 k€) e 3.9.1.1.1 Pavimento desportivo (100,2 k€).
6. **Descrições.** Reescrever 2.2.3/2.2.4, 2.3.11, 2.5.1, 3.11.2.13.2, 3.13.4/5 e todo o capítulo 7 (características mínimas por artigo).
7. **Omissões.** Acrescentar os artigos da secção 5, ou declarar por escrito que estão excluídos do âmbito.
8. **Preços.** Consultar pelo menos 3 subempreiteiros para: contenção ancorada e microestacas, amianto, madeira lamelada, caixilharia, painel sandwich, pavimento desportivo, AVAC, elétrica/fotovoltaico, SADI/CCTV, ascensor e paisagismo.
9. **Geotecnia.** Confirmar no estudo geotécnico a natureza do terreno (rocha?) e o nível freático antes de fechar os capítulos 2.1 e 2.2.
10. **Concurso público.** Se for um concurso público em Portugal, submeter a **lista de erros e omissões** (art. 50.º do CCP) dentro do prazo do procedimento. Pelo **art. 378.º, n.º 3**, o empreiteiro suporta **50 %** dos erros e omissões que eram detetáveis na fase de formação do contrato e não foram reclamados. Atenção também ao regime do **preço anormalmente baixo** (arts. 70.º–71.º).

---

## 11. Limitações
- Não foram fornecidos desenhos, caderno de encargos nem memória descritiva. As medições não foram confirmadas contra o projeto e as duplicações e omissões marcadas "a confirmar" dependem dessa verificação.
- As referências de mercado são indicativas (Portugal 2025–2026). A validação final de preços exige consultas formais.
- As referências normativas e legais devem ser confirmadas nas versões consolidadas em vigor (Diário da República, IPQ/CEN).

---

### Fontes consultadas
- [Habitissimo – Remoção de coberturas em fibrocimento (preços indicativos)](https://www.habitissimo.pt/orcamentos/remocao-de-coberturas-em-fibrocimento)
- [LNEC – Número mínimo de ensaios em ancoragens](https://repositorio.lnec.pt/jspui/bitstream/123456789/1000815/1/N%c3%9aMERO%20M%c3%8dNIMO%20DE%20ENSAIOS%20EM%20ANCORAGENS.pdf)
- [Geotech – Testing of ground anchors (EN 1537 / EN ISO 22477-5)](https://www.geotech.hr/en/testing-of-ground-anchors/)
- [APCMC – Remoção de amianto em edifícios (DL 266/2007)](https://apcmc.pt/legislacao/remocao-de-amianto-em-edificios-e-equipamentos-das-empresas/)
- [APA – Portaria 40/2014 (RCD com amianto)](https://apambiente.pt/sites/default/files/_Residuos/FluxosEspecificosResiduos/RCD/Portaria40-2014_RCDA.pdf)
- [Obramat – vigas GL24h (preço de material por m³)](https://www.obramat.es/productos/viga-abeto-laminado-gl24h-calidad-vista-400x20x20-cm-25096046.html)
- [LNEC – Lamelado colado em Portugal](https://repositorio.lnec.pt/bitstream/123456789/1002156/1/Viabilidade%20do%20fabrico%20de%20estruturas%20de%20madeira%20lamelada%20colada%20com%20pinho%20bravo%20tratado.pdf)
- [CCDR Centro – Erros e omissões no CCP](https://www.ccdrc.pt/pt/34100/)
- [CM Tomar – Deliberação (art. 378.º n.º 3 CCP)](https://cm-tomar.pt/images/CMT/municipio/documentos/Reunioes_Camara/Deliberacao/Deliberacoes%2010_18_2026_01_26.pdf)
- [PLMJ – Newsletter Construção (STA 15-05-2025, erros e omissões)](https://www.plmj.com/xms/files/NL-Pub_Construcao-2o_Trimestre.pdf)
- [jurisprudencia.pt – STA, preço anormalmente baixo](https://jurisprudencia.pt/acordao/339795/)
