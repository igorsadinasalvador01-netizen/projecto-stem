# Pavimentos – Pavilhão da Escola EB2,3 João de Meira (R01)

Esta é a conclusão do modelo `PAVIMENTO_DESPORTIVO.xlsx`. Os critérios são os mesmos da medição do Lar de S. Jorge:
- fonte de cada valor;
- fórmula explícita;
- estado (Extraído / Calculado / Interpretado / Assumido);
- registo de discrepâncias com o MQT de venda.

| Ficheiro | Uso |
|---|---|
| `PAVIMENTO_DESPORTIVO_Medicao_R01.xlsx` | Modelo completo (ver folhas abaixo) |
| `prints/P1…P7`, `prints/E03_*` | Recortes das plantas com as áreas e comprimentos medidos |

Folhas do livro:
- **PV Interiores / PV Exteriores:** as duas folhas originais, com a coluna G toda preenchida. A coluna G está ligada à folha de detalhe.
- **MEDIÇÃO DETALHADA:** linha de total por artigo e, por baixo, as parcelas. Mostra também o valor anterior do modelo, a diferença para o MQT em quantidade e em €, o estado e a fonte.
- **DISCREPÂNCIAS:** os 38 artigos que se afastam do MQT, que foram corrigidos ou que ficam a confirmar.
- **CRITÉRIOS E FONTES:** escalas, métodos e pressupostos.
- **PRINTS:** as imagens de evidência (P1–P7 e E03_0–E03_2).

## Fontes

- `3.2_ACABAMENTOS.dwfx`: folhas 3.2.1 (1:250), 3.2.2 Piso 01 (1:200) e 3.2.3 Piso 02 (1:200).
- `1._DESENHOS_GERAIS__200_S_NTESE.dwfx`: síntese, quadros de áreas e cortes.
- `MQT_CUSTO-VENDA.XLS`: quantidades e preços de venda.

As exportações AutoCAD/GstarCAD não trazem propriedades de objeto, por isso tudo foi medido sobre a geometria vetorial.

## Como foi medido

- **Manchas preenchidas** (PAV I, soleiras): área exata de cada polígono da cor da legenda.
- **Tramas de linhas** (PAV E 01–06, lajetas): rasterizadas a 10 px/mm e fechadas morfologicamente.
  - Validação: o PAV E 02 dá 2481,29 m² a 1:200 e 2478,98 m² a 1:250.
- **Linhas tracejadas** (rodapés, rede, estores, guias corten): os traços são encadeados; um intervalo maior que 0,30 m (vão de porta) corta o troço.
- **Caldeiras:** círculo ajustado aos pontos corten.
- **Assentos e degraus:** contados um a um.
- **Valores já existentes no modelo:**
  - diferença até 3% → mantém-se o valor do modelo;
  - diferença acima de 3% → adota-se a medição, e o valor anterior fica registado.

## Principais resultados

**Valores corrigidos face ao que estava no modelo:**
- **Ginásio (PAV I 01 e marcações):** 375 → 396,56 m². O 375 era a área útil do quadro de áreas; a mancha de acabamento mede 396,56.
- **Soleiras interiores 200 mm:** 31,9 → 24,69 ml.
- **Soleiras exteriores:**
  - 400 mm: 105,3 → 110,26 ml;
  - 200 mm: 15,9 → 8,21 ml.
  - As soleiras de 0,305 m passam para a classe de 400 mm.
- **Rodapé em azulejo RP I 01:** 100,7 → 92,00 ml.
- **Estores:**
  - Ginásio: 12,3 → 12,80 ml;
  - Polidesportivo: 40,5 → 42,29 ml.

**Medições novas próximas do MQT:**

| Artigo | Medição R01 | MQT |
|---|---:|---:|
| P.T.3 | 263,06 m² | 262,82 m² |
| Degraus de bancada interiores | 14 un. | 14 un. |
| PAV I 02 Piso 01 | 270,88 m² | 280 m² |
| Caldeiras | 25,86 ml | 28 ml |
| Lajetas de reposição | 133,09 m² | 150 m² |
| Degrau de remate | 16,62 m² | 18 m² |

**Diferenças grandes, a confirmar:**
- **Guia corten:** 427,11 ml contra 210 no MQT. O MQT só conta a orla da pista, que mede 210,65 ml.
- **PAV E 03:** 1519,77 m² contra 1680. Segue os artigos do MQT de venda: o PAV E 03 é o único artigo de betuminoso, por isso leva a Área A (trama roxa, 891,65) e a Área B (betuminoso pontilhado a sudoeste, 628,12). As lajetas a repor (133,09 m²) ficam no artigo 3.9.2.13. O MQT parece ter contado as lajetas também no PAV E 03 (891,65 + 628,12 + 133,09 = 1652,86 ≈ 1680). Ver `prints/E03_0…E03_2`.
- **PAV E 05:** 296,24 m² contra 210. É a soma das manchas dos dois pisos; o MQT só usou a folha do Piso 01.
- **P.T.1 e endurecedor:** 331,24 m² contra 419,56.
- **COB 04:** 220,36 m² contra 265.
- **Cortinas:** 50 ml contra 90.
- **Microcimento:** 14,42 m² contra 23,5.
- **Gradil:** 28,42 m² contra 17,18.

**Assumido = MQT** (não há peça desenhada que permita medir):
- demolições;
- passeio;
- guias rasas 400 e 100;
- lajetas 400×600;
- degraus da bancada exterior;
- soleiras em chapa quinada.

**Mantido do modelo, sem confirmação:** a rede de proteção (764,4 m²). A altura da rede não está cotada; os comprimentos em planta somam 130,82 m.

O banco pré-fabricado junto à pista (trama magenta, 91,04 m²) é o artigo 3.17.1 do MQT (187 ml) e não entra no PAV E 04.

O impacto líquido das diferenças, a preço de venda do MQT, é cerca de −8,4 k€. O detalhe está na folha MEDIÇÃO DETALHADA.
