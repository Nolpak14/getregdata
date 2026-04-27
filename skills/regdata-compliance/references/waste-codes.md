# BDO Waste Registry - Codes, Tables, and ESG Mapping

Reference guide for interpreting BDO registration data, waste activity tables, and mapping results to environmental reporting frameworks.

## Registration Tables (Dzialy Rejestru)

BDO registration is organized into 11 tables. Each table covers a distinct category of waste-related activity. An entity's table registrations determine what they are legally authorized to do.

| Table | Polish Name | Covers | Who Registers |
|---|---|---|---|
| I | Wprowadzający produkty w opakowaniach | Products in packaging | Manufacturers and importers of packaged goods |
| II | Wprowadzający produkty (oleje, opony) | Oil and tire producers | Manufacturers and importers of lubricants and tires |
| III | Wprowadzający pojazdy | Vehicle importers | Importers of new vehicles, producers |
| IV | Sprzęt elektryczny i elektroniczny | Electrical/electronic equipment (WEEE) | Producers, importers of electronics |
| V | Wprowadzający baterie i akumulatory | Batteries and accumulators | Battery/accumulator producers and importers |
| VI | Wytwórcy odpadów | Waste generators | Companies generating hazardous or >5t/yr non-hazardous waste |
| VII | Transportujący odpady | Waste transporters | Licensed waste transport companies |
| VIII | Sprzedawcy/pośrednicy odpadów | Waste brokers and dealers | Entities trading in waste without physical possession |
| IX | Przetwarzający odpady | Waste treatment operators | Recycling, incineration, landfill, recovery facilities |
| X | Prowadzący PSZOK | Municipal collection points (PSZOK) | Operators of municipal selective waste collection points |
| XI | Organizacje odzysku | Recovery organizations | Organizations managing collective recovery obligations |

### How to Verify a Contractor

**Waste transport contractor** - Must appear in Table VII. If they only have Table VI, they can generate waste but not transport it.

**Waste disposal facility** - Must appear in Table IX. Check that their permitted waste codes match the waste you need processed.

**Waste broker** - Must appear in Table VIII. Brokers arrange waste transactions without physical handling.

**Packaging compliance** - Importers or producers must appear in Table I. If they use a recovery organization, that org should appear in Table XI.

## Common Waste Codes

Waste codes in BDO follow the European Waste Catalogue (EWC) system - 6-digit codes in the format XX YY ZZ. Codes ending in an asterisk (*) denote hazardous waste.

| Code | Description | Common Source |
|---|---|---|
| 15 01 01 | Paper and cardboard packaging | Retail, logistics |
| 15 01 02 | Plastic packaging | Manufacturing, retail |
| 15 01 06 | Mixed packaging | General commercial |
| 17 01 01 | Concrete | Construction, demolition |
| 17 02 01 | Wood | Construction |
| 17 09 04 | Mixed construction waste | Renovation, demolition |
| 20 03 01 | Mixed municipal waste | General commercial |
| 16 01 03 | End-of-life tires | Automotive |
| 13 02 08* | Other engine/gear/lubricating oils (hazardous) | Automotive, industrial |
| 16 02 13* | WEEE containing hazardous components | Electronics |
| 15 01 10* | Packaging with residues of hazardous substances | Chemical, pharma |
| 19 12 04 | Plastic from waste treatment | Recycling facilities |

## Province Codes (Województwa)

BDO registration is province-specific. Use these values in the `province` parameter:

| Province | Capital | Key Industrial Focus |
|---|---|---|
| Dolnośląskie | Wrocław | Mining, electronics manufacturing |
| Kujawsko-pomorskie | Bydgoszcz/Toruń | Chemical industry, food processing |
| Lubelskie | Lublin | Agriculture, food processing |
| Lubuskie | Gorzów Wlkp./Zielona Góra | Wood processing, general manufacturing |
| Łódzkie | Łódź | Textile, pharmaceutical |
| Małopolskie | Kraków | Chemical, metallurgy |
| Mazowieckie | Warszawa | Largest province - all sectors |
| Opolskie | Opole | Cement, construction materials |
| Podkarpackie | Rzeszów | Aviation, IT manufacturing |
| Podlaskie | Białystok | Food processing, timber |
| Pomorskie | Gdańsk | Shipbuilding, petrochemical |
| Śląskie | Katowice | Heavy industry, mining, metallurgy (highest waste volume) |
| Świętokrzyskie | Kielce | Construction materials, mining |
| Warmińsko-mazurskie | Olsztyn | Food processing, tourism |
| Wielkopolskie | Poznań | Automotive, food processing |
| Zachodniopomorskie | Szczecin | Shipbuilding, chemical |

## Registration Status Interpretation

| Status | Polish | Can Operate? | Action Required |
|---|---|---|---|
| Active | Aktywny | Yes | None - valid registration |
| Suspended | Zawieszony | No | Do not contract until status is resolved; request explanation from the entity |
| Deregistered | Wykreślony | No | Entity has been removed; find an alternative contractor |

**Important:** An entity that was never registered in BDO but should be (based on their activities) is operating illegally. Contracting with an unregistered waste handler exposes your organization to administrative fines and reputational risk.

## ESG Reporting Mapping

### GRI 306: Waste (2020)

| GRI Disclosure | BDO Data Point |
|---|---|
| 306-1: Waste generation | Table VI registration confirms generator status |
| 306-2: Management of significant waste-related impacts | Table registrations show which disposal methods are used |
| 306-3: Waste generated (by composition) | Waste codes from contractor registrations map to waste types |
| 306-4: Waste diverted from disposal | Table IX operators with recovery codes (R-codes) |
| 306-5: Waste directed to disposal | Table IX operators with disposal codes (D-codes) |

### CSRD / ESRS E5: Resource Use and Circular Economy

| ESRS Requirement | BDO Evidence |
|---|---|
| E5-5: Resource outflows - waste | BDO registration tables + waste codes document the waste chain |
| Circular economy targets | Table IX recovery operators demonstrate recycling partnerships |
| Supply chain due diligence | BDO verification of all waste handlers in the value chain |

### ISO 14001:2015

| ISO Requirement | BDO Application |
|---|---|
| 6.1.3: Compliance obligations | BDO registration is a legal compliance obligation for waste activities |
| 8.1: Operational planning and control | Verify contractor BDO registrations before engaging |
| 9.1.2: Evaluation of compliance | Periodic BDO status checks confirm ongoing compliance |

### Practical ESG Workflow

1. **Identify** all entities in your waste chain (generators, transporters, treatment facilities)
2. **Verify** each entity's BDO registration using the actor
3. **Map** their table registrations to the waste activities they perform for you
4. **Document** findings in your ESG report with BDO registration numbers as evidence
5. **Monitor** periodically - re-run BDO checks quarterly or when renewing contracts
