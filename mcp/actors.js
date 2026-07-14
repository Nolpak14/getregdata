// Auto-generated from the live Apify fleet. 29 regdata actors.
// Regenerate with scripts/gen-manifest (see repo).
export const ACTORS = [
  {
    "slug": "adverse-media-screener",
    "tool": "regdata_adverse_media",
    "title": "Adverse Media Screener - KYC/AML Negative News Check",
    "description": "Screen a person or company for adverse media (negative news) for KYC/AML and due diligence. Returns categorized, LLM-classified hits - fraud, corruption, sanctions, money laundering and more - with the entity's role, a severity score and source provenance. False positives filtered out."
  },
  {
    "slug": "austria-ediktsdatei-scraper",
    "tool": "regdata_austria_ediktsdatei",
    "title": "Austria Insolvency & Court Publications Scraper",
    "description": "Scrape Austrian insolvency data from the Ediktsdatei - bankruptcies, reorganizations, debt settlements, court auctions, and Firmenbuch announcements. Official court publications with no API alternative."
  },
  {
    "slug": "bdo-waste-registry-scraper",
    "tool": "regdata_bdo_waste_registry",
    "title": "Poland BDO Waste Registry Scraper",
    "description": "Rejestr BDO - baza danych o odpadach. Search 674,000+ waste management entities by name or NIP. Returns BDO registry number, company name, NIP, and address (province, district, commune, city, street, postcode). Answers \"is this company in the BDO register, and what is its BDO number?\" - registration status, waste codes and permits are behind a BDO login and are not part of the public register. No API exists. ESG compliance, environmental due diligence. Gospodarka odpadami."
  },
  {
    "slug": "belgium-kbo-company-scraper",
    "tool": "regdata_belgium_kbo_company",
    "title": "Belgium KBO/BCE Company Scraper - Directors & VAT",
    "description": "Scrape Belgium's KBO/BCE registry from the official public search: company identity, status, legal form, address, NACEBEL activity codes and NAMED directors/managers. Lookup by enterprise/VAT number or company name. No API key."
  },
  {
    "slug": "borme-corporate-acts-scraper",
    "tool": "regdata_borme_corporate_acts",
    "title": "Spain BORME Corporate Acts Parser",
    "description": "Parse daily BORME (Boletin Oficial del Registro Mercantil) Section A PDFs into structured corporate acts - company incorporations, officer appointments, capital changes, dissolutions, and more."
  },
  {
    "slug": "california-sos-business-scraper",
    "tool": "regdata_california_sos_business",
    "title": "California SoS Business Scraper - Agent & Status",
    "description": "Scrape the California Secretary of State business registry (bizfileOnline): entity name, number, status, standing, type, formation date and registered agent. Search by name or entity number. The registry returns at most 500 matches for a term - a list that hits that ceiling is reported as INCOMPLETE, so a missing entity is not proof it is unregistered; narrow the term and re-run. No API key needed."
  },
  {
    "slug": "california-ucc-lien-scraper",
    "tool": "regdata_california_ucc_lien",
    "title": "California UCC Lien Search - Debtors & Secured Parties",
    "description": "Search the California Secretary of State UCC filing index (bizfileOnline) by debtor or secured-party name. Get filing number, UCC type, status, filing & lapse dates, debtors and secured parties. The registry rejects a term matching more than 1,000 filings as \"too broad\" - that refusal is reported as such and is NOT \"no liens\"; narrow the debtor name and re-run. No API key needed."
  },
  {
    "slug": "crbr-beneficial-owners-scraper",
    "tool": "regdata_crbr_beneficial_owners",
    "title": "Poland CRBR Beneficial Owners Scraper",
    "description": "Automate Polish beneficial owner verification for KYC/AML onboarding. Search the official public registry by NIP or KRS to return structured UBO data: names, citizenship, control nature, ownership %. Pay-per-result, no subscription. Pairs with debtor and KNF checks."
  },
  {
    "slug": "czech-isir-insolvency-scraper",
    "tool": "regdata_czech_isir_insolvency",
    "title": "Czech ISIR Insolvency Register Search",
    "description": "Search the Czech insolvency register (ISIR) by company or debtor name, IČO or city. Get debtor name, IČO, case reference, court, proceeding status and the commercial-register cross-link. The register serves at most 400 rows per search and REFUSES a broader query outright - a refusal is reported as such and is NOT \"no records\". includeEnded defaults to true, which pulls in closed proceedings and makes a common surname more likely to be refused; set it false or add the IČO/city and re-run. No API key."
  },
  {
    "slug": "ekw-ksiegi-wieczyste-scraper",
    "tool": "regdata_ekw_ksiegi_wieczyste",
    "title": "Poland EKW Land Registry Scraper Ksiegi Wieczyste",
    "description": "Extract property data from Poland's Electronic Land Registry (Elektroniczne Ksiegi Wieczyste): ownership, mortgages, restrictions, property details. Keyless - no proxy or API key needed. For property due diligence and credit-risk checks. Pay per result."
  },
  {
    "slug": "germany-handelsregister-scraper",
    "tool": "regdata_germany_handelsregister",
    "title": "Germany Handelsregister Scraper",
    "description": "Search the German Commercial Register (Handelsregister) by company name or register number. Extract company data, officers / managing directors (Geschäftsführer) with dates of birth, capital, legal form, seat, business purpose. No official API - structured JSON for KYC, KYB & due diligence."
  },
  {
    "slug": "germany-insolvency-scraper",
    "tool": "regdata_germany_insolvency",
    "title": "Germany Insolvency Register Search (Insolvenzbekanntmachungen)",
    "description": "Search Germany's official insolvency register (Insolvenzbekanntmachungen) by company or debtor name. Get court, case number, publication date, seat and the Handelsregister reference. When a term matches too many announcements the register declines to enumerate them - that \"too many matches\" state is reported as such and is NOT \"no insolvencies\"; narrow the query and re-run. No API key."
  },
  {
    "slug": "italy-pec-lookup",
    "tool": "regdata_italy_pec",
    "title": "Italy PEC Lookup - Certified Email & SDI Code by VAT",
    "description": "Resolve an Italian company's certified PEC email (domicilio digitale) and SDI e-invoicing code from a Partita IVA, Codice Fiscale or company name. For fatturazione elettronica, KYC and bulk enrichment. No official API."
  },
  {
    "slug": "italy-registro-imprese-scraper",
    "tool": "regdata_italy_registro_imprese",
    "title": "Italy Registro Imprese Scraper - Company Data & PEC",
    "description": "Search Italy's official Registro Imprese (InfoCamere) by company name and extract free-tier company data: name, registered office, PEC (certified email), legal form, ATECO activity and business description. No official API - structured JSON."
  },
  {
    "slug": "knf-registry-scraper",
    "tool": "regdata_knf_registry",
    "title": "Poland KNF Financial Registry Scraper",
    "description": "Extract payment institutions, e-money issuers, credit intermediaries, lending companies & pawnbroking operators from 3 Polish KNF registries. Search by name, NIP, entity type. Bulk export 75,000+ entities. Structured JSON. No auth needed."
  },
  {
    "slug": "krs-fullnames-scraper",
    "tool": "regdata_krs_fullnames",
    "title": "Poland KRS Board Members & Shareholders Scraper",
    "description": "Extract full non-anonymized board member & shareholder names from Polish KRS (National Court Register). The official API censors names to \"L******\" - this actor downloads the public PDF extract with complete names, roles, and company metadata."
  },
  {
    "slug": "krz-debtor-scraper",
    "tool": "regdata_krz_debtor",
    "title": "Poland KRZ National Debtor Registry Scraper",
    "description": "Automate bankruptcy and restructuring checks against the official public debtor registry. Nine search modes cover companies, persons, sole traders, case signatures, proceedings, shareholders, and assets. The bankruptcyEstate mode returns the trustee's filed estate inventory (spis masy upadlosci) for a company's proceedings - real estate, movables, cash, property rights and receivables, each with the trustee's own valuation, quantity and status. Pass entityName and/or identifier (proceedings are resolved for you) or a proceedingId; estateInventoryPublished:false means the register reports zero assets for that proceeding - a verified zero, not a failed lookup. For distressed-asset sourcing and creditor recovery-prospect assessment. Build a credit-risk watchlist or insolvency workflow. Pay-per-result."
  },
  {
    "slug": "msig-scraper",
    "tool": "regdata_msig",
    "title": "Poland MSiG Court Gazette Scraper",
    "description": "Search Polish Court & Economic Gazette (Monitor Sądowy i Gospodarczy) for bankruptcy declarations, liquidation notices, restructuring proceedings, creditor calls. Full-text search across archive from 2001. Structured JSON output."
  },
  {
    "slug": "poland-krs-financial-scraper",
    "tool": "regdata_poland_krs_financial",
    "title": "Poland KRS Financial Statements Scraper",
    "description": "Extract structured financial statements - balance sheets, income statements, assets, equity, revenue, net profit - from official public company filings. Parses XML, XHTML, and iXBRL into JSON. Use in credit-risk or M&A due-diligence workflows. Pay-per-result."
  },
  {
    "slug": "poland-parliamentary-pep-scraper",
    "tool": "regdata_poland_parliamentary_pep",
    "title": "Poland Parliamentary PEP Scraper - Sejm Members for KYC/AML",
    "description": "Structured PEP dataset of Polish Sejm members across terms - names, dates of birth, party, district, profession - for KYC/AML screening. Official Sejm API source"
  },
  {
    "slug": "polish-premises-prospector",
    "tool": "regdata_polish_premises",
    "title": "Polish Premises Prospector - REGON jednostki lokalne",
    "description": "Build prospect lists at the physical-site level from the Polish REGON registry. One row per premise (jednostka lokalna) with industry (PKD), address, company age, and ownership, filterable by region (TERYT)."
  },
  {
    "slug": "polish-regon-scraper",
    "tool": "regdata_polish_regon",
    "title": "Polish REGON Scraper - GUS Business Registry (no API key)",
    "description": "Scrape Poland's REGON (GUS) registry anonymously: look up by NIP/REGON/KRS, discover companies by address + PKD, and get local units (jednostki lokalne) as separate rows. No API key required."
  },
  {
    "slug": "slovakia-rpvs-ubo-scraper",
    "tool": "regdata_slovakia_rpvs_ubo",
    "title": "Slovakia RPVS Beneficial Owners (UBO) Scraper",
    "description": "Search Slovakia's public beneficial-ownership register (RPVS) by IČO or company name. Returns beneficial owners with a public-official (PEP) flag, plus the authorised person. No API key."
  },
  {
    "slug": "societe-com-scraper",
    "tool": "regdata_societe_com",
    "title": "France Societe.com Company Scraper",
    "description": "Scrape French company data from Societe.com - directors, simplified financials, shareholders, subsidiaries, and corporate relationships. The richest free French company data source with no API."
  },
  {
    "slug": "spain-company-directory-scraper",
    "tool": "regdata_spain_company_directory",
    "title": "Spain Company Directory Scraper - Registro Mercantil",
    "description": "Scrape company data from Spain's official OpenData Registradores directory. Get NIF, officers, CNAE codes, legal form, address, and status from the Registro Mercantil - no API exists for this data."
  },
  {
    "slug": "spain-concursal-scraper",
    "tool": "regdata_spain_concursal",
    "title": "Spain Registro Público Concursal Search",
    "description": "Search Spain's official public insolvency register (Registro Público Concursal) by debtor name or NIF. Returns each matching party with its role - debtor, disqualified, or insolvency administrator. No API key."
  },
  {
    "slug": "uae-adgm-public-register-scraper",
    "tool": "regdata_uae_adgm_public_register",
    "title": "UAE ADGM Public Register Scraper - Company Data",
    "description": "Scrape the Abu Dhabi Global Market (ADGM) public register: company name, registration number, status, type, classification, incorporation date, address and trade names. Search by name, identifier or trade name. No API key."
  },
  {
    "slug": "uokik-clauses-scraper",
    "tool": "regdata_uokik_clauses",
    "title": "Poland UOKiK Abusive Clauses Registry Scraper",
    "description": "Rejestr klauzul niedozwolonych UOKiK - 7,500+ zakazanych postanowień umownych. Search court-banned contract clauses by defendant, industry, legal category. No API exists. Legal compliance, consumer protection. JSON."
  },
  {
    "slug": "wko-business-directory-scraper",
    "tool": "regdata_wko_business_directory",
    "title": "Austria WKO Business Directory Scraper",
    "description": "Scrape 620,000+ Austrian businesses from WKO Firmen A-Z - the official Chamber of Commerce directory. Get company names, addresses, phone numbers, emails, websites, industry codes, and trade licenses. No API exists for this data."
  }
];
export default ACTORS;
