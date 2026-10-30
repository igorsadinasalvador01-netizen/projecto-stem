# Medição de Betão e Aço – Lar de S. Jorge, Pevidém (R01)

Nova medição feita no mesmo modelo da planilha `Mod._Arm_-_PS_000.xls`:
- **RESUMO**;
- uma folha de detalhe por tipo de elemento, com Nº, C, L, H, betão, cofragem, aço por diâmetro e aço de empalmes.

| Ficheiro | Uso |
|---|---|
| `22128_Medicao_Betao_Aco_R01.xlsx` | Versão principal (fórmulas + valores calculados) |
| `22128_Medicao_Betao_Aco_R01.xls` | Mesmo conteúdo no formato do original |

## Fonte

`22128.ES.EXE.PD.R00.dwfx` (exportação Revit de 22/06/2023, folhas ES0001 a ES0601). Os DWG da mesma série estão no formato AutoCAD 2007 e não puderam ser convertidos neste ambiente.

O DWFx contém:
- os desenhos vetoriais, de onde foram lidos os quadros, cortes e pormenores de armaduras;
- as propriedades de cada elemento do modelo (volumes, áreas, comprimentos e cotas), usadas com precisão nativa.

Cada linha da planilha indica a folha e o Id Revit de origem (coluna AS) e o estado da linha (coluna AT): Extraído, Calculado, Interpretado, Assumido ou Estimado.

## Resultados globais

| | Medição R01 | MQT | MQT − R01 |
|---|---:|---:|---:|
| Betão estrutural (m³) | 172,85 | 177,75 | +4,90 |
| Betão de limpeza (m²) | 119,51 | 117,85 | −1,66 |
| Laje aligeirada (m²) | 48,96 | 50,00 | +1,04 |
| Aço sem empalmes (kg) | 21 378 | — | — |
| Aço com empalmes 50Ø (kg) | 21 627 | 24 469 | +2 842 |
| Cofragem (m²) | 934,70 | 896,48 | −38,22 |

O volume do modelo BIM para os mesmos elementos é de 172,59 m³ (coluna T do RESUMO).

## Principais discrepâncias

O registo completo, com 21 entradas, está na folha **DISCREPÂNCIAS**.

- **Poços PF1:** o MQT tem 25,34 m³; a geometria dá 20,36 m³ (4 poços Ø1,20 × 4,50 m, tangentes).
- **Aço da VE1:** o MQT tem 223 kg, o que corresponde a uma só viga; existem duas VE1, com 395 kg no total.
- **Aço das paredes do elevador:** o MQT tem 2388 kg; a medição dá 1071 kg (o Revit tem ≈ 994 kg modelados).
- **Aço do ensoleiramento do elevador:** o MQT tem 522 kg; a medição dá 264 kg (o Revit tem 267 kg modelados).
- **Aço das lajes da Zona C:** o MQT tem 1092 kg; a medição dá 513 kg.
- **Sapata S10:** o desenho indica H = 0,60 e o modelo tem H = 0,50. A medição usa 0,60.
- **Valores assumidos, a confirmar:**
  - estribos não indicados nas vigas VA5.2, VA7.2, VB3.C e VB4.C;
  - peso por m² da malhasol AR46;
  - número de vigotas da laje LAC1.C.

Os critérios de medição (recobrimentos, amarrações e emendas de 50Ø, regras de cofragem, exclusões) estão na folha **CRITÉRIOS E FONTES**.
