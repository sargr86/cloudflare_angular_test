import {getAssetFromKV, defaultKeyModifier} from "@cloudflare/kv-asset-handler"
import parser from "accept-language-parser"

const DEBUG = false

addEventListener("fetch", async (event) => {
  event.respondWith(handleEvent(event))
});

const strings = {
  de: {
    title: "Beispielseite",
    headline: "Beispielseite",
    subtitle:
      "Dies ist meine Beispielseite. Abhängig davon, wo auf der Welt Sie diese Site besuchen, wird dieser Text in die entsprechende Sprache übersetzt.",
    disclaimer:
      "Haftungsausschluss: Die anfänglichen Übersetzungen stammen von Google Translate, daher sind sie möglicherweise nicht perfekt!",
    tutorial: "Das Tutorial für dieses Projekt finden Sie in der Cloudflare Workers-Dokumentation.",
    copyright: "Design von HTML5 UP.",
  },
  en: {
    headline: "Test!!!"
  }
}

class ElementHandler {
  constructor(countryStrings) {
    this.countryStrings = countryStrings
  }

  element(element) {
    const i18nKey = element.getAttribute("data-i18n-key")
    if (i18nKey) {
      const translation = this.countryStrings[i18nKey]
      if (translation) {
        element.setInnerContent(translation)
      }
    }
  }
}

async function handleEvent(event) {
  const url = new URL(event.request.url)
  try {
    let options = {}
    if (DEBUG) {
      options = {
        cacheControl: {
          bypassCache: true,
        },
      }
    }
    const languageHeader = event.request.headers.get("Accept-Language")
    const language = parser.pick(["en"], languageHeader)
    const countryStrings = strings[language] || {};

    const response = await getAssetFromKV(event, options)
    let t = new HTMLRewriter();

    console.log('aaa', strings.en)
    return new HTMLRewriter().on("[data-i18n-key]", new ElementHandler(countryStrings)).transform(response)
  } catch (e) {
    if (DEBUG) {
      return new Response(e.message || e.toString(), {
        status: 404,
      })
    } else {
      return new Response(`"${defaultKeyModifier(url.pathname)}" not found`, {
        status: 404,
      })
    }
  }
}
