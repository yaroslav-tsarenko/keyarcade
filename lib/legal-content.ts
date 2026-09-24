// Website policies, transcribed from the official Keyarcade policy pack.
// A block is either a paragraph (string), a bulleted list ({ list }) or an
// inline subheading ({ subheading }). The /legal/[doc] page renders each.

export type LegalBlock = string | { list: string[] } | { subheading: string };

export interface LegalSection {
  heading: string;
  body: LegalBlock[];
}
export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED = "2026-08-27";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    slug: "terms",
    title: "Terms and Conditions",
    updated: UPDATED,
    intro:
      "These Terms and Conditions govern access to keyarcade.com and purchases of game keys, software activation codes, subscription codes, gift cards, wallet top-ups and other digital products supplied by PRENKORO OÜ.",
    sections: [
      {
        heading: "1. About Us",
        body: [
          "The website and the Products offered through it are operated and sold by PRENKORO OÜ, registration number 17555038, registered at Harju maakond, Tallinn, Kesklinna linnaosa, Maakri tn 19/2, 10145, Estonia. Contact: info@keyarcade.com.",
          "PRENKORO OÜ acts as the seller. Product information and availability may be obtained through third-party catalogue and distribution systems, but the purchase contract is concluded with PRENKORO OÜ unless expressly stated otherwise.",
        ],
      },
      {
        heading: "2. Definitions",
        body: [
          {
            list: [
              "Account: a customer account registered on the Website.",
              "Customer: the person accessing the Website or purchasing a Product.",
              "Order: a request submitted through the Website to purchase one or more Products.",
              "Product: a digital game key, software licence key, subscription code, gift card, wallet top-up or other digital code offered through the Website.",
              "Product Code: the unique activation key, serial number, voucher code or similar credential supplied after purchase.",
              "Publisher: the developer, publisher, platform operator, gift card issuer, software provider or other third party responsible for the underlying content or service.",
            ],
          },
        ],
      },
      {
        heading: "3. Eligibility",
        body: [
          "You may use the Website and purchase Products only if all of the following conditions are satisfied:",
          {
            list: [
              "you are at least 18 years old and have legal capacity to enter into a binding contract;",
              "the information you provide is accurate and complete;",
              "you are not located in, ordinarily resident in or purchasing from a restricted country;",
              "your use of the Website and Product is permitted by applicable law; and",
              "you are purchasing for legitimate personal use and not for unauthorised commercial resale.",
            ],
          },
          "We may request reasonable information necessary to verify identity, age, location, payment authority or eligibility. A lawful verification failure may result in an Order being delayed, rejected or cancelled.",
        ],
      },
      {
        heading: "4. Customer Accounts",
        body: [
          "You are responsible for maintaining accurate Account information, protecting your login credentials, preventing unauthorised access and promptly notifying us if your Account may have been compromised.",
          "You must not use false information, impersonate another person, use another person’s payment method without permission or use multiple Accounts to evade limits, regional restrictions, security controls or promotional conditions.",
          "We may proportionately restrict or suspend an Account where reasonably necessary to investigate suspected fraud, unlawful activity, unauthorised access, abusive conduct, payment disputes or a material breach of these Terms. Suspension does not remove mandatory rights relating to valid earlier purchases.",
        ],
      },
      {
        heading: "5. Geographic Restrictions",
        body: [
          "Products are not offered to persons located in, ordinarily resident in or purchasing from Afghanistan, Belarus, Central African Republic, Cuba, Democratic Republic of the Congo, Haiti, Iran, Iraq, Mali, Myanmar (Burma), North Korea, Russia, Somalia, South Sudan, Sudan, Syria, Venezuela, Yemen or Zimbabwe.",
          "We may also refuse or cancel an Order where the Customer, payment instrument, transaction or intended use is subject to applicable sanctions, export controls, payment-network restrictions or other legal prohibitions.",
          "You must not use a VPN, proxy, false address, third-party payment instrument or other means to conceal your actual location or bypass a geographic or Product-specific restriction.",
        ],
      },
      {
        heading: "6. Product Information",
        body: [
          "Before ordering, you must review the Product title, edition, activation platform, region, supported languages, compatibility, account requirements, activation instructions, any redemption deadline, the denomination and currency of a gift card or wallet top-up, and other material restrictions shown on the Product page.",
          "A purchase normally provides a Product Code only and does not include a physical disc, card, box, manual or other tangible item. Product images are illustrative unless expressly stated otherwise.",
          "Catalogue information may originate from Publishers or third-party distributors. We take reasonable steps to keep it accurate. If a material description, price, region, platform or availability error is identified, we may correct it and, where necessary, cancel the affected Order and provide the appropriate refund.",
        ],
      },
      {
        heading: "7. Third-Party Platforms and Publisher Terms",
        body: [
          "Activation may require a third-party platform Account and acceptance of the Publisher’s terms, licence agreement, privacy notice, regional rules and technical requirements.",
          "PRENKORO OÜ does not control Publisher platform availability, third-party account suspensions, online servers, future hardware or software changes, or third-party subscription renewal settings. This does not exclude our responsibility to supply a Product Code that conforms to its description and applicable mandatory requirements at the time of supply.",
        ],
      },
      {
        heading: "8. Orders and Contract Formation",
        body: [
          "Products displayed on the Website are an invitation to place an Order and not a binding offer. By submitting an Order, you offer to purchase the selected Product under these Terms and the information displayed during checkout.",
          "An automated acknowledgement confirms receipt but does not necessarily constitute acceptance. An Order is accepted when payment is approved, availability is confirmed and the Product Code is made available in your Account or sent to your email address.",
          "We may reject or cancel an Order before acceptance if the Product is unavailable, payment cannot be authorised, there is a material pricing or description error, a purchase limit applies, verification cannot be completed, the transaction appears unauthorised or unlawful, or completing it would breach applicable restrictions. If payment has already been collected for an unfulfilled Order, the amount due will be returned without undue delay.",
        ],
      },
      {
        heading: "9. Prices, Currencies and Taxes",
        body: [
          "Products may be offered in EUR, GBP and USD. The currency displayed during checkout is the currency in which we request payment.",
          "Your bank or card issuer may apply its own exchange rate, foreign-transaction charge or cross-border processing fee. These charges are not controlled by PRENKORO OÜ.",
          "The total amount payable to PRENKORO OÜ will be displayed before the Order is submitted. PRENKORO OÜ is not currently registered for value added tax and does not have a VAT registration number. We will not state a VAT registration number or separately identify an amount as VAT unless our applicable tax status changes. Any charge that we are legally required to collect will be disclosed before submission.",
        ],
      },
      {
        heading: "10. Payment",
        body: [
          "Payments may be made using Visa and Mastercard. Availability may depend on country, currency, device, transaction value and security checks.",
          "Payment is processed through authorised payment service infrastructure. PRENKORO OÜ does not normally receive or store the complete card number or card security code processed directly by the payment service provider.",
          "You confirm that you are authorised to use the selected payment method, the billing information is accurate, sufficient funds or credit are available and the payment is not connected with fraud, money laundering, sanctions evasion or other unlawful conduct.",
        ],
      },
      {
        heading: "11. Security and Fraud Prevention",
        body: [
          "Orders may be subject to automated or manual security review. We may temporarily delay delivery while reviewing a transaction presenting a reasonable fraud, security, sanctions or payment risk.",
          "We may request proportionate verification of the purchaser, payment authority, country or billing location, Account integrity or legitimacy of the Order. Verification information is handled under the Privacy Policy.",
          "We may refuse or cancel Orders connected with stolen payment instruments, compromised Accounts, false identities, unauthorised bulk buying, commercial resale, chargeback abuse or attempts to circumvent technical or geographic controls.",
        ],
      },
      {
        heading: "12. Digital Delivery",
        body: [
          "Products are supplied digitally. Following successful payment and any required security review, the Product Code will normally be displayed in the Customer’s Account and sent to the email address provided for the Order.",
          "You are responsible for entering an accurate email address and maintaining access to it. If the email is not visible, check spam, junk and promotions folders, verify the Account email, review the Order page and contact info@keyarcade.com if the code remains unavailable.",
          "Delivery may be delayed by payment verification, security review, technical issues or temporary catalogue availability. No exact delivery time is guaranteed unless expressly stated during checkout.",
        ],
      },
      {
        heading: "13. Immediate Supply and Right of Withdrawal",
        body: [
          "Products are digital content not supplied on a tangible medium. Where applicable law provides a withdrawal period, we may ask you during checkout to expressly request immediate supply before that period expires and to acknowledge that you will lose the statutory withdrawal right once supply begins.",
          "Where legally required, the request and acknowledgement will be obtained separately during checkout and confirmed in the Order confirmation or another durable electronic format.",
          "The withdrawal exception does not remove rights relating to a Product Code that is invalid, duplicate, previously redeemed, materially different from its description or otherwise non-conforming. See the Refund, Cancellation and Withdrawal Policy.",
        ],
      },
      {
        heading: "14. Activation and Customer Responsibilities",
        body: [
          "After delivery you must keep the Product Code confidential, redeem it only on the correct platform, comply with regional and technical restrictions, follow activation instructions and redeem it before any stated expiry date.",
          "Do not publicly share screenshots, emails or Account pages containing a visible code. Product Codes may be redeemable by any person who obtains them.",
          "We are not responsible for redemption by another person after secure delivery where disclosure resulted from the Customer sharing the code, losing control of email or Account access, or failing to protect credentials. This does not apply where disclosure resulted from a security failure for which PRENKORO OÜ is legally responsible.",
        ],
      },
      {
        heading: "15. Games, Software, Subscriptions and Stored Value",
        body: [
          "A game or software Product generally grants a limited right to activate or access the relevant content under the Publisher’s licence. Intellectual-property ownership is not transferred.",
          "Subscription Products provide access for the period, platform and region shown. A Publisher may require an eligible account or payment method and may operate its own renewal settings. Unless clearly disclosed and separately accepted, purchasing from PRENKORO OÜ does not authorise PRENKORO OÜ to charge you automatically for renewal.",
          "Gift cards and wallet top-ups are issued for the platform, denomination, currency and region shown. The Publisher operates the third-party wallet or stored-value account; PRENKORO OÜ remains responsible for supplying a Product Code conforming to its description.",
        ],
      },
      {
        heading: "16. Refunds and Non-Conforming Products",
        body: [
          "Contact us promptly if a code is not delivered, invalid, already redeemed before delivery, revoked through no fault of the Customer, for the wrong platform or region compared with its description, or otherwise materially non-conforming.",
          "We may request reasonable evidence such as the Order number, error message, activation screenshot, platform and region information, or Publisher support confirmation. Do not disclose the complete Product Code publicly.",
          "Depending on the circumstances and applicable law, remedies may include activation assistance, replacement, bringing the Product into conformity, a price reduction, cancellation or refund. Nothing in these Terms excludes a remedy that cannot lawfully be excluded.",
        ],
      },
      {
        heading: "17. Chargebacks and Payment Disputes",
        body: [
          "Before initiating a chargeback, contact info@keyarcade.com so that we have a reasonable opportunity to investigate and resolve the issue.",
          "You must not falsely claim that a legitimately authorised and properly delivered Order was unauthorised, undelivered or defective. Where a chargeback is opened, we may provide the relevant financial institution with reasonably necessary Order, delivery, Account, communication and security records in accordance with the Privacy Policy.",
          "We may proportionately restrict further purchases while a dispute remains unresolved. This does not prevent legitimate consumer or payment rights.",
        ],
      },
      {
        heading: "18. Prohibited Use",
        body: [
          {
            list: [
              "using the Website for unlawful or fraudulent purposes;",
              "using stolen, unauthorised or falsified payment information;",
              "interfering with Website security or operation;",
              "using bots, scripts or automated purchasing tools without permission;",
              "scraping or reproducing the catalogue for commercial purposes;",
              "circumventing purchase, Account, regional or security restrictions;",
              "unauthorised commercial resale of Products;",
              "false refund, non-delivery or chargeback claims;",
              "unauthorised access to another Account; or",
              "infringement of the rights of PRENKORO OÜ, a Publisher or another person.",
            ],
          },
        ],
      },
      {
        heading: "19. Intellectual Property",
        body: [
          "The Website’s original text, design, graphics, software, databases and branding are owned by or licensed to PRENKORO OÜ and protected by applicable intellectual-property law.",
          "Game titles, software names, platform names, logos, screenshots, artwork and other third-party materials belong to their respective owners. References identify compatible Products and do not imply sponsorship, endorsement or affiliation unless expressly stated.",
        ],
      },
      {
        heading: "20. Website Availability and Liability",
        body: [
          "We aim to keep the Website and Account functions available but cannot guarantee uninterrupted or error-free operation. Access may be temporarily restricted for maintenance, security, legal or technical reasons.",
          "Nothing in these Terms excludes liability for fraud, intentional misconduct, death or personal injury caused by negligence, breach of mandatory consumer rights, failure to supply conforming digital content, or any liability that cannot legally be excluded.",
          "Subject to mandatory law, PRENKORO OÜ is not responsible for loss caused by selecting an accurately described but incorrect platform, region, edition or language; failing disclosed requirements; Customer disclosure of a Product Code; or Publisher action resulting from the Customer’s breach of Publisher terms.",
        ],
      },
      {
        heading: "21. Privacy",
        body: [
          "Personal data is processed under the Privacy Policy. This may include processing necessary to manage Accounts, process and deliver Orders, prevent fraud, provide support, comply with legal and accounting obligations, handle refunds and disputes, and maintain security.",
        ],
      },
      {
        heading: "22. Complaints and Consumer Disputes",
        body: [
          "Complaints should be sent to info@keyarcade.com with the Order number, the email used for the Order, a clear description and relevant evidence. For consumer complaints governed by Estonian law, we aim to provide a written response no later than 15 days after receipt.",
          "If a dispute between an Estonian consumer and PRENKORO OÜ cannot be resolved directly, the consumer may be entitled to apply to the Estonian Consumer Disputes Committee, Endla 10A, 10122 Tallinn, Estonia, at https://ttja.ee/en/consumer-disputes-committee. Nothing prevents recourse to a competent court.",
        ],
      },
      {
        heading: "23. Governing Law and Jurisdiction",
        body: [
          "These Terms and contracts concluded under them are governed by Estonian law. If you are a consumer residing elsewhere, this choice does not deprive you of mandatory protection under the law of your habitual residence.",
          "A dispute may be brought before a court having jurisdiction under applicable law. No consumer is required to waive a court that has mandatory jurisdiction over the claim.",
        ],
      },
      {
        heading: "24. Changes, Severability and Contact",
        body: [
          "We may update these Terms to reflect changes in law, Products, payment methods, security or Website functions. The version presented when an Order was submitted generally governs that Order; updates will not retroactively remove established rights.",
          "If a provision is unlawful or unenforceable, it will be limited to the minimum necessary and the remainder will continue. Failure to enforce a provision is not a waiver.",
          "Contact: PRENKORO OÜ, registration number 17555038, Harju maakond, Tallinn, Kesklinna linnaosa, Maakri tn 19/2, 10145, Estonia; info@keyarcade.com; https://www.keyarcade.com.",
        ],
      },
    ],
  },

  refunds: {
    slug: "refunds",
    title: "Refund, Cancellation and Withdrawal Policy",
    updated: UPDATED,
    intro:
      "This Policy explains when an Order may be cancelled and what remedies are available for non-delivery, invalid or non-conforming Product Codes. It forms part of the Terms and Conditions.",
    sections: [
      {
        heading: "1. Scope",
        body: [
          "This Policy applies to digital Products sold by PRENKORO OÜ through keyarcade.com, including games, software, subscriptions, gift cards and wallet top-ups.",
          "Mandatory consumer rights take priority over any inconsistent limitation in this Policy.",
        ],
      },
      {
        heading: "2. Digital Nature of Products",
        body: [
          "A Product Code is unique digital content that may be copied or redeemed after disclosure. Once delivered to the Account and email address, it may no longer be possible to verify that it has remained unused without assistance from the relevant Publisher.",
          "This characteristic affects voluntary cancellations but does not remove legal rights where the Product is defective, non-conforming or not supplied.",
        ],
      },
      {
        heading: "3. Cancellation Before Delivery",
        body: [
          "You may request cancellation before the Product Code has been supplied. A cancellation request is not effective merely because an email was sent before you opened the delivery message; automated supply may occur immediately after payment.",
          "If the Order has not yet been accepted or delivered, we will normally cancel it and release or return the payment. If the code has already been supplied, the withdrawal and conformity rules below apply.",
        ],
      },
      {
        heading: "4. Statutory Right of Withdrawal",
        body: [
          "Consumers may have a statutory period in which to withdraw from a distance contract. For digital content not supplied on a tangible medium, that right may be lost once supply begins only where the consumer has expressly requested immediate supply, acknowledged the resulting loss of the withdrawal right and received the required confirmation.",
          "Where the required consent or confirmation has not been validly obtained, the Customer retains any withdrawal rights provided by applicable law.",
          "A withdrawal waiver does not waive rights relating to non-delivery, invalidity, duplication, prior redemption, revocation, misdescription or another lack of conformity.",
        ],
      },
      {
        heading: "5. Non-Delivery",
        body: [
          "Before reporting non-delivery, check the Order page in your Account and the spam, junk and promotions folders of the email address used for the Order.",
          "If the Product Code is not available in the Account or by email within a reasonable time, contact info@keyarcade.com. We will investigate delivery and either supply the Product, provide an appropriate alternative with your agreement, or refund the amount due if fulfilment is not possible.",
        ],
      },
      {
        heading: "6. Invalid, Duplicate or Previously Redeemed Codes",
        body: [
          "Contact us promptly if the Publisher reports that a code is invalid or was redeemed before it was delivered to you.",
          "We may verify the code with the distributor or Publisher. If the Product was non-conforming at delivery, the available remedy may include replacement, correction, price reduction or refund in accordance with applicable law.",
          "A code redeemed after secure delivery by the Customer or by a person to whom the Customer disclosed it is not defective solely because it can no longer be redeemed again.",
        ],
      },
      {
        heading: "7. Wrong Product, Platform, Region or Description",
        body: [
          "If the supplied Product materially differs from the confirmed Order or Product description, contact us before redeeming it where reasonably possible.",
          "If the Product page accurately identified the platform, region, edition, language or compatibility and the Customer selected the wrong Product, a refund may not be available after supply and valid withdrawal waiver. This does not apply where the description was unclear, incorrect or legally insufficient.",
        ],
      },
      {
        heading: "8. Revoked Codes",
        body: [
          "If a Publisher revokes a code after activation, contact us with the Order information and any notice from the Publisher. We will investigate whether the revocation relates to a defect existing at supply, the source of the code, Customer conduct or a Publisher account issue.",
          "Where the Product was non-conforming and the Customer did not cause the revocation, remedies will be provided as required by law.",
        ],
      },
      {
        heading: "9. Evidence and Investigation",
        body: [
          "We may request only information reasonably necessary to assess the issue, including:",
          {
            list: [
              "the Order number and Account email;",
              "the exact error message and the date and time of activation;",
              "a screenshot showing the relevant platform and error without publicly exposing the full code;",
              "the platform account region;",
              "Publisher support correspondence; or",
              "other information directly relevant to whether the code was valid and unused at delivery.",
            ],
          },
          "Do not publish the complete Product Code or send unrelated credentials, passwords or payment-card details.",
        ],
      },
      {
        heading: "10. Available Remedies",
        body: [
          "Depending on applicable law and the circumstances, PRENKORO OÜ may provide activation assistance, replacement, correction, a proportionate price reduction, cancellation or refund.",
          "Where repair or replacement is legally appropriate, it will be provided within a reasonable time and without significant inconvenience. A refund or price reduction will be provided where required, including when conformity cannot be restored, the problem is sufficiently serious or a remedy has failed.",
        ],
      },
      {
        heading: "11. Refund Method and Timing",
        body: [
          "Approved monetary refunds are normally returned to the original payment method. We will not require store credit instead of a monetary refund where applicable law entitles the Customer to money back.",
          "Refunds will be initiated without undue delay and within any mandatory legal deadline. The bank or card issuer may require additional processing time after the refund is initiated. Currency movements and third-party bank charges may cause the received amount to differ from the Customer’s converted account value, although we refund the amount due in the transaction currency.",
        ],
      },
      {
        heading: "12. Chargebacks, Abuse and Contact",
        body: [
          "Contact us before initiating a chargeback so we can investigate. This request does not restrict legitimate payment or consumer rights.",
          "Fraudulent refund claims, altered evidence, false non-delivery statements or knowingly false chargebacks may lead to Account restrictions and may be reported where legally appropriate.",
          "Submit requests to info@keyarcade.com with the Order number and a concise explanation.",
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    updated: UPDATED,
    intro:
      "This Privacy Policy explains how PRENKORO OÜ collects, uses, discloses and protects personal data when you use keyarcade.com, create an Account, place an Order or contact support.",
    sections: [
      {
        heading: "1. Controller and Contact Details",
        body: [
          "The controller is PRENKORO OÜ, registration number 17555038, Harju maakond, Tallinn, Kesklinna linnaosa, Maakri tn 19/2, 10145, Estonia. Privacy enquiries and rights requests may be sent to info@keyarcade.com.",
        ],
      },
      {
        heading: "2. Scope",
        body: [
          "This Policy applies to personal data processed in connection with the Website, Accounts, Orders, digital delivery, customer support, fraud prevention, complaints, refunds and related communications.",
          "It does not govern independent processing by Publishers, platform operators, banks or other third parties acting for their own purposes. Review their privacy information before using those services.",
        ],
      },
      {
        heading: "3. Data We Collect",
        body: [
          { subheading: "Information you provide" },
          {
            list: [
              "name, email address, billing country and Account details;",
              "Order selections, transaction currency and delivery information;",
              "support messages, complaints, screenshots and activation evidence;",
              "marketing preferences and consent choices; and",
              "verification information where reasonably required for security or legal compliance.",
            ],
          },
          { subheading: "Information collected automatically" },
          {
            list: [
              "IP address, browser, device, operating system and approximate location derived from technical data;",
              "Website activity, session, referral and interaction information;",
              "Account login, delivery and security logs; and",
              "cookie identifiers and consent records where cookies or similar technologies are used.",
            ],
          },
          { subheading: "Information received from service providers" },
          {
            list: [
              "payment status, transaction reference and limited fraud indicators;",
              "catalogue, Product availability and fulfilment information;",
              "email delivery status; and",
              "security, chargeback or dispute information.",
            ],
          },
        ],
      },
      {
        heading: "4. Purposes and Legal Bases",
        body: [
          "Contract: to register Accounts, process payment status, accept and fulfil Orders, deliver Product Codes, provide support and administer refunds.",
          "Legal obligation: to maintain legally required records, respond to authorities, comply with sanctions and financial rules, and handle statutory consumer or data-protection requests.",
          "Legitimate interests: to secure the Website, prevent fraud, protect payment systems, manage disputes, improve service performance and establish or defend legal claims, provided those interests are not overridden by individual rights.",
          "Consent: for optional cookies, direct electronic marketing where required and any other processing expressly presented as consent-based.",
        ],
      },
      {
        heading: "5. Payments",
        body: [
          "Card payments are processed through payment service infrastructure. PRENKORO OÜ does not normally receive or store the complete payment-card number or card security code.",
          "We receive limited transaction information such as payment status, amount, currency, reference, card type or masked details, and risk indicators necessary to administer the Order and prevent fraud.",
        ],
      },
      {
        heading: "6. Automated Fraud and Security Checks",
        body: [
          "Transactions may be evaluated using automated risk signals and may be referred for manual review. Relevant signals may include location inconsistencies, transaction patterns, device or network indicators, failed attempts and information received from payment or security providers.",
          "A risk result may temporarily delay or prevent an Order. Where applicable law grants rights concerning a decision based solely on automated processing that produces legal or similarly significant effects, you may request human review, express your position and contest the result by contacting us.",
        ],
      },
      {
        heading: "7. Recipients of Personal Data",
        body: [
          "We may disclose personal data only as reasonably necessary to categories of recipients including:",
          {
            list: [
              "payment and transaction-processing providers;",
              "Product catalogue, distribution and fulfilment providers;",
              "hosting, infrastructure, cybersecurity and technical-support providers;",
              "email and customer-communication providers;",
              "analytics, consent-management or advertising providers where enabled and lawfully used;",
              "banks, card networks and dispute-resolution participants;",
              "professional advisers, auditors and insurers; and",
              "courts, regulators, law-enforcement or other public authorities where disclosure is legally required or permitted.",
            ],
          },
          "These recipients process data under their own legal responsibilities or under contractual instructions, depending on their role.",
        ],
      },
      {
        heading: "8. International Transfers",
        body: [
          "Some service providers may process personal data outside Estonia or the European Economic Area. Where required, we use an adequacy decision, approved contractual safeguards or another lawful transfer mechanism and assess supplementary protections as appropriate.",
          "You may contact us for information about the safeguards relevant to a transfer, subject to lawful confidentiality restrictions.",
        ],
      },
      {
        heading: "9. Retention",
        body: [
          "We retain personal data only for as long as reasonably necessary for the stated purpose, including:",
          {
            list: [
              "Account data while the Account is active and for a reasonable period afterwards;",
              "Order, payment and accounting records for the period required by applicable accounting, tax and commercial law;",
              "support, complaint and dispute records while the matter is active and for the relevant limitation or defence period;",
              "security and fraud records for a proportionate period needed to protect the service and handle disputes;",
              "marketing data until consent is withdrawn, an objection is made or the data is no longer needed; and",
              "cookie consent records for the period necessary to demonstrate and respect the choice.",
            ],
          },
          "Data may be retained longer where required by law, a regulator, a legal hold or the establishment, exercise or defence of a claim.",
        ],
      },
      {
        heading: "10. Security",
        body: [
          "We use reasonable technical and organisational measures intended to protect personal data against accidental loss, unauthorised access, alteration, disclosure or destruction. Measures may include access controls, encryption in transit, logging, supplier controls, backups and security review.",
          "No internet service can guarantee absolute security. Protect your Account password and notify us promptly if you suspect unauthorised access.",
        ],
      },
      {
        heading: "11. Your Rights",
        body: [
          "Subject to applicable conditions and exceptions, you may have the right to:",
          {
            list: [
              "access personal data and receive information about its processing;",
              "correct inaccurate or incomplete data;",
              "request erasure;",
              "restrict processing;",
              "receive portable data where the right applies;",
              "object to processing based on legitimate interests or to direct marketing;",
              "withdraw consent without affecting earlier lawful processing; and",
              "exercise rights concerning qualifying automated decisions.",
            ],
          },
          "Send a request to info@keyarcade.com. We may request proportionate information to verify identity and protect the Account.",
        ],
      },
      {
        heading: "12. Marketing Communications",
        body: [
          "We send promotional electronic communications only where permitted by law. You may opt out using the unsubscribe mechanism or by contacting us.",
          "Service messages about Orders, security, Account operation, policies or support are not marketing and may still be sent where necessary.",
        ],
      },
      {
        heading: "13. Children",
        body: [
          "The Website and Products are intended only for persons aged 18 or over. We do not knowingly offer Accounts or Products to children. If you believe a child has provided personal data, contact us so we can investigate and take appropriate action.",
        ],
      },
      {
        heading: "14. Cookies",
        body: [
          "Cookies and similar technologies are described in the Cookie Policy. Optional technologies will be used only under an appropriate legal basis and consent mechanism where required.",
        ],
      },
      {
        heading: "15. Complaints",
        body: [
          "You may first contact info@keyarcade.com so we can address the concern.",
          "You also have the right to lodge a complaint with the Estonian Data Protection Inspectorate or, where applicable, another competent supervisory authority. Estonian Data Protection Inspectorate: Tatari 39, 10134 Tallinn, Estonia; https://www.aki.ee.",
        ],
      },
      {
        heading: "16. Policy Changes",
        body: [
          "We may update this Policy to reflect legal, technical or operational changes. The current version and last-updated date will be published on the Website. Material changes will be communicated where required.",
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    updated: UPDATED,
    intro:
      "This Cookie Policy explains how PRENKORO OÜ uses cookies and similar technologies on keyarcade.com and how visitors can control optional technologies.",
    sections: [
      {
        heading: "1. What Cookies Are",
        body: [
          "Cookies are small text files stored on a device when a website is visited. Similar technologies may include local storage, pixels, tags or software development tools that store or access information on a device.",
        ],
      },
      {
        heading: "2. Who Is Responsible",
        body: [
          "PRENKORO OÜ, registration number 17555038, is responsible for the Website’s use of cookies. Contact: info@keyarcade.com.",
        ],
      },
      {
        heading: "3. Cookie Categories",
        body: [
          "Strictly necessary: used for core Website operation, security, Account login, checkout, fraud prevention, load balancing and consent choices. These cannot normally be disabled through the preference centre because the requested service would not function correctly.",
          "Functional: remember optional preferences such as language, currency or interface choices.",
          "Analytics: help understand Website use, navigation, performance and errors so the service can be improved.",
          "Advertising: may be used to measure campaigns, limit repeated advertisements or personalise advertising where lawful and enabled.",
        ],
      },
      {
        heading: "4. First-Party and Third-Party Technologies",
        body: [
          "First-party cookies are set for the Website domain. Third-party technologies may be provided by service categories such as payments, security, infrastructure, consent management, analytics or advertising.",
          "The cookie-preference interface identifies the technologies active for the visitor, their purposes and available choices.",
        ],
      },
      {
        heading: "5. Legal Bases and Consent",
        body: [
          "Strictly necessary technologies are used where required to provide a requested service, secure the Website or remember privacy choices.",
          "Functional, analytics and advertising technologies that require consent will not be activated until valid consent is given. Refusing optional cookies must be as accessible as accepting them, and refusal does not prevent access to core Website functions.",
        ],
      },
      {
        heading: "6. Cookie Duration",
        body: [
          "Session cookies expire when the browser session ends. Persistent cookies remain for a defined period or until deleted.",
          "Retention varies by purpose. The Website’s cookie-preference interface provides the current duration or expiry information for enabled technologies.",
        ],
      },
      {
        heading: "7. Managing Preferences",
        body: [
          "You can accept, reject or customise optional technologies through the cookie banner or preference centre. You may change or withdraw consent at any time through the cookie settings link available on the Website.",
          "Withdrawal does not affect processing that was lawful before withdrawal. The preference will be applied prospectively and may require refreshing the page.",
        ],
      },
      {
        heading: "8. Browser Controls",
        body: [
          "Most browsers permit cookies to be blocked or deleted. Blocking strictly necessary cookies may prevent login, checkout, currency selection, security checks or other essential functions.",
          "Browser-level controls do not always communicate a legally valid preference to every technology, so the Website preference centre should also be used.",
        ],
      },
      {
        heading: "9. Personal Data",
        body: [
          "Cookie information may constitute personal data when it identifies or can reasonably be linked to a person, device or Account. Processing of such data is also governed by the Privacy Policy.",
        ],
      },
      {
        heading: "10. Changes and Contact",
        body: [
          "We may update this Policy when technologies, purposes or legal requirements change. The current version will be published with its last-updated date.",
          "Questions may be sent to PRENKORO OÜ at info@keyarcade.com.",
        ],
      },
    ],
  },

  delivery: {
    slug: "delivery",
    title: "Digital Delivery Policy",
    updated: UPDATED,
    intro:
      "This Policy explains how Product Codes are delivered, when security reviews may delay delivery and what Customers should do if a code is not received.",
    sections: [
      {
        heading: "1. Digital-Only Fulfilment",
        body: [
          "All Products are delivered digitally. No physical disc, card, box, document or parcel will be shipped unless a Product page expressly states otherwise.",
        ],
      },
      {
        heading: "2. Delivery Channels",
        body: [
          "After successful payment and any required review, the Product Code will normally be displayed in the relevant Order area of the Customer’s Account and sent to the email address used for the Order.",
          "The Order confirmation may contain the Product Code directly or provide secure access to it. Customers should store Order information securely.",
        ],
      },
      {
        heading: "3. Delivery Timing",
        body: [
          "Delivery is normally automated after payment confirmation. An exact time is not guaranteed unless expressly stated during checkout.",
          "We do not offer pre-orders. Products are offered for delivery following payment confirmation and any required security review.",
        ],
      },
      {
        heading: "4. Security Review",
        body: [
          "Delivery may be temporarily delayed while an Order is reviewed for payment authority, fraud, Account security, sanctions, location inconsistency or another reasonable risk.",
          "We may request proportionate verification. A review will not be used to impose an indefinite delay. If the Order cannot lawfully or safely be completed, it will be cancelled and the amount due returned.",
        ],
      },
      {
        heading: "5. Customer Email Responsibilities",
        body: [
          "Customers must enter a valid email address, keep it accessible and protect it against unauthorised access.",
          "PRENKORO OÜ is not responsible for delay caused solely by an incorrectly entered email address, an over-quota mailbox, customer-side filtering or loss of access, but will provide reasonable assistance after identity and Order details are verified.",
        ],
      },
      {
        heading: "6. If the Email Is Missing",
        body: [
          {
            list: [
              "check spam, junk, promotions and similar folders;",
              "confirm the email address shown in the Account or Order;",
              "review the Order page in the Account;",
              "allow a reasonable period for payment and security processing; and",
              "contact info@keyarcade.com if the code is still unavailable.",
            ],
          },
        ],
      },
      {
        heading: "7. Incorrect Email Address",
        body: [
          "Contact support promptly if an incorrect address was entered. We may require reasonable identity and payment verification before changing delivery information or reissuing access.",
          "If a Product Code was sent to the address provided and accessed or redeemed by another person, the circumstances will be investigated. A replacement is not automatic where the error was caused by the Customer, but mandatory legal rights remain unaffected.",
        ],
      },
      {
        heading: "8. Availability and Fulfilment Failure",
        body: [
          "Catalogue availability may change between display and fulfilment. If the Product becomes unavailable, we may offer an equivalent alternative only with the Customer’s agreement or cancel and refund the affected Order.",
          "We will not replace the ordered Product with a materially different Product without consent.",
        ],
      },
      {
        heading: "9. Delivery and Confidentiality",
        body: [
          "A Product Code should be treated as a confidential bearer credential. Do not share it publicly or provide screenshots containing the complete code.",
          "Delivery records may be used to establish when and where the code was made available, subject to the Privacy Policy.",
        ],
      },
      {
        heading: "10. Support and Remedies",
        body: [
          "For delivery issues, contact info@keyarcade.com with the Order number and Account email. Do not send a full card number, security code or Account password.",
          "Non-delivery remedies are described in the Refund, Cancellation and Withdrawal Policy and mandatory consumer law.",
        ],
      },
    ],
  },

  complaints: {
    slug: "complaints",
    title: "Complaints and Dispute Resolution Policy",
    updated: UPDATED,
    intro:
      "This Policy explains how Customers can submit a complaint and how PRENKORO OÜ handles unresolved consumer disputes.",
    sections: [
      {
        heading: "1. Contacting Us First",
        body: [
          "We encourage Customers to contact us promptly so that an issue can be investigated and resolved directly.",
          "Complaints should be sent to info@keyarcade.com.",
        ],
      },
      {
        heading: "2. Information to Include",
        body: [
          {
            list: [
              "the Order number;",
              "the email address used for the Order;",
              "a concise description of the issue;",
              "the remedy requested; and",
              "relevant screenshots, error messages or Publisher correspondence.",
            ],
          },
          "Do not send a complete payment-card number, card security code, password or unrelated identity document.",
        ],
      },
      {
        heading: "3. Acknowledgement and Review",
        body: [
          "We will review the complaint fairly, consider relevant evidence and may request proportionate additional information.",
          "The Customer will not be required to obtain evidence that is impossible or unreasonably burdensome where PRENKORO OÜ or its fulfilment provider can reasonably verify the relevant fact.",
        ],
      },
      {
        heading: "4. Response Time",
        body: [
          "For consumer complaints governed by Estonian law, PRENKORO OÜ will provide a written response no later than 15 days after receiving the complaint.",
          "If the matter cannot be fully resolved within that period, the response will explain our position, any information still needed and the proposed next step.",
        ],
      },
      {
        heading: "5. Possible Outcomes",
        body: [
          "Depending on the issue and applicable law, an outcome may include an explanation, activation assistance, correction, replacement, price reduction, cancellation, refund, Account restoration or rejection of an unsupported claim with reasons.",
        ],
      },
      {
        heading: "6. Payment Disputes",
        body: [
          "Customers should contact us before starting a chargeback where practical. This gives us an opportunity to investigate but does not restrict legitimate card or consumer rights.",
          "We may provide the bank or card network with Order, delivery and communication records necessary to answer a dispute, in accordance with the Privacy Policy.",
        ],
      },
      {
        heading: "7. Consumer Disputes Committee",
        body: [
          "If a dispute between a consumer resident in Estonia and PRENKORO OÜ cannot be resolved directly, the consumer may apply to the independent Estonian Consumer Disputes Committee.",
          "Consumer Disputes Committee, Endla 10A, 10122 Tallinn, Estonia. Website: https://ttja.ee/en/consumer-disputes-committee.",
        ],
      },
      {
        heading: "8. Cross-Border Consumers",
        body: [
          "Consumers resident in another European Union or European Economic Area country may seek assistance from the competent consumer advice or alternative dispute-resolution body available in their country, subject to that body’s jurisdiction.",
          "The former European Online Dispute Resolution platform has been discontinued and is not presented as an available complaint channel.",
        ],
      },
      {
        heading: "9. Court Proceedings and Records",
        body: [
          "Nothing in this Policy prevents either party from bringing a claim before a competent court or exercising another mandatory remedy.",
          "Complaint records are retained for the period reasonably necessary to resolve the matter, meet legal obligations and establish or defend claims, as described in the Privacy Policy.",
        ],
      },
    ],
  },

  "acceptable-use": {
    slug: "acceptable-use",
    title: "Restricted Countries and Acceptable Use Policy",
    updated: UPDATED,
    intro:
      "This Policy describes geographic restrictions, prohibited conduct and measures used to protect Customers, payment systems and the lawful distribution of digital Products.",
    sections: [
      {
        heading: "1. Restricted Countries",
        body: [
          "The Website does not offer Products to persons located in, ordinarily resident in or purchasing from:",
          {
            list: [
              "Afghanistan; Belarus; Central African Republic; Cuba;",
              "Democratic Republic of the Congo; Haiti; Iran; Iraq; Mali;",
              "Myanmar (Burma); North Korea; Russia; Somalia;",
              "South Sudan; Sudan; Syria; Venezuela; Yemen; and Zimbabwe.",
            ],
          },
        ],
      },
      {
        heading: "2. Additional Legal Restrictions",
        body: [
          "We may also restrict a transaction where required by sanctions, export controls, payment-network rules, court orders or another applicable legal obligation.",
          "A country not listed above may still be subject to a Product-specific platform or activation restriction.",
        ],
      },
      {
        heading: "3. Location Accuracy",
        body: [
          "Customers must provide accurate country, billing and Account information. A payment instrument issued in a restricted jurisdiction or a material inconsistency between location indicators may trigger review.",
          "You must not use a VPN, proxy, false address, nominee, forwarding arrangement or another person’s payment instrument to conceal location or bypass a restriction.",
        ],
      },
      {
        heading: "4. Personal Use and Resale",
        body: [
          "Products are intended for legitimate personal use, including genuine personal gifting where the Product permits it.",
          "Commercial resale, brokering, automated stock acquisition or redistribution of Product Codes requires prior written authorisation. Purchase limits may be applied to protect availability and reduce fraud.",
        ],
      },
      {
        heading: "5. Payment and Account Abuse",
        body: [
          {
            list: [
              "using stolen, compromised or unauthorised payment methods;",
              "creating false identities or Accounts;",
              "taking over another Account;",
              "testing payment cards or credentials;",
              "structuring Orders to evade limits or verification;",
              "making knowingly false refund, non-delivery or chargeback claims; and",
              "using Products in connection with money laundering or unlawful value transfer.",
            ],
          },
        ],
      },
      {
        heading: "6. Technical Abuse",
        body: [
          {
            list: [
              "interfering with security, availability or integrity of the Website;",
              "introducing malware or conducting denial-of-service activity;",
              "scraping the catalogue for commercial purposes;",
              "using bots or automated checkout tools without permission;",
              "probing for vulnerabilities outside a lawful authorised programme; and",
              "circumventing rate limits, access controls or anti-fraud measures.",
            ],
          },
        ],
      },
      {
        heading: "7. Product and Intellectual-Property Abuse",
        body: [
          "Customers must not reproduce, publish, sell or distribute Product Codes unlawfully, remove proprietary notices, misrepresent affiliation with PRENKORO OÜ or a Publisher, or use Website materials in a manner infringing intellectual-property rights.",
        ],
      },
      {
        heading: "8. Enforcement Measures",
        body: [
          "Where reasonably supported by the circumstances, PRENKORO OÜ may delay or refuse an Order, request proportionate verification, restrict purchasing, suspend an Account, cancel an affected Order, preserve evidence or report suspected unlawful activity.",
          "Measures will be proportionate to the risk and will not remove mandatory consumer rights. Where appropriate, the Customer may contact support to explain the circumstances or contest an Account measure.",
        ],
      },
      {
        heading: "9. Refunds Following Cancellation",
        body: [
          "If PRENKORO OÜ cancels an unfulfilled Order under this Policy after payment has been collected, the amount due will be returned to the original payment method unless the funds are lawfully frozen, reversed or otherwise subject to a binding restriction.",
        ],
      },
      {
        heading: "10. Reporting and Contact",
        body: [
          "Suspected Account compromise, payment abuse, unlawful resale or security issues may be reported to info@keyarcade.com. Provide only information relevant to the report and do not transmit passwords or complete card details.",
        ],
      },
    ],
  },

  accessibility: {
    slug: "accessibility",
    title: "Accessibility Statement",
    updated: UPDATED,
    intro:
      "PRENKORO OÜ aims to make keyarcade.com and the associated purchasing journey usable by as many people as reasonably possible, including people who use assistive technologies.",
    sections: [
      {
        heading: "1. Our Approach",
        body: [
          "We aim to design and maintain the Website around the principles that digital information and interfaces should be perceivable, operable, understandable and robust.",
          "Accessibility is considered across Product browsing, Account creation, checkout, payment, Order confirmation, digital delivery, support and information about cancellation and refunds.",
        ],
      },
      {
        heading: "2. Accessibility Measures",
        body: [
          "Measures we aim to support include:",
          {
            list: [
              "keyboard access to core navigation and purchasing functions;",
              "clear headings, labels and instructions;",
              "sufficient colour contrast and visible keyboard focus;",
              "meaningful alternatives for informative images;",
              "forms that identify errors and explain how to correct them;",
              "content that can be enlarged without loss of essential information;",
              "compatibility with commonly used screen-reader and browser features; and",
              "accessible Order, delivery, refund and support communications where reasonably possible.",
            ],
          },
        ],
      },
      {
        heading: "3. Third-Party Components",
        body: [
          "The purchasing journey may use third-party payment, security, catalogue or communication components. We seek to select and configure such components so that they do not create avoidable barriers.",
          "Some accessibility characteristics may depend on technology operated by another provider. Customers may report any barrier encountered in those components to us.",
        ],
      },
      {
        heading: "4. Current Conformance",
        body: [
          "Accessibility is an ongoing process. This Statement does not claim that every page, device combination or third-party component is free from all accessibility barriers.",
          "We review reported issues and make proportionate improvements based on impact, feasibility and applicable legal requirements.",
        ],
      },
      {
        heading: "5. Alternative Assistance",
        body: [
          "If you cannot access essential Product, Order, delivery, refund or complaint information, contact us and describe the format or assistance needed. We will seek to provide the information or a reasonable alternative without unnecessary delay.",
        ],
      },
      {
        heading: "6. Feedback",
        body: [
          "Accessibility feedback may be sent to info@keyarcade.com. Please include the page or function involved, the barrier encountered, the device or assistive technology used where you are comfortable providing it, and the preferred way for us to respond.",
          "Do not include passwords, complete payment-card information or other data not needed to investigate the issue.",
        ],
      },
      {
        heading: "7. Response and Escalation",
        body: [
          "We will review accessibility feedback and respond within a reasonable period. If the issue also concerns an Order or consumer complaint, the Complaints and Dispute Resolution Policy applies.",
          "Nothing in this Statement limits a right to contact the competent authority or pursue a remedy available under applicable accessibility or consumer law.",
        ],
      },
    ],
  },
};

export const LEGAL_SLUGS = Object.keys(LEGAL_DOCS);
