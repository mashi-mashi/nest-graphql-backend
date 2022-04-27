import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { safeStringify } from 'src/util/safe-stringify';

@Injectable()
export class ParseOgpUsecase {
  private readonly logger = new Logger(ParseOgpUsecase.name);

  async parseOgp(url: string): Promise<any> {
    if (!url) return;
    // HTMLのmetaタグからogpを抽出
    const extractOgp = (metaElements: HTMLMetaElement[]) => {
      const ogp = metaElements
        .filter((e) => e.hasAttribute('property'))
        .reduce((prev, current) => {
          const property = current.getAttribute('property')?.trim();
          if (!property) return;

          const content = current.getAttribute('content');
          prev[property] = content;
          return prev;
        }, {});

      return ogp;
    };

    try {
      const encodedUri = encodeURI(url);
      const headers = { 'User-Agent': 'bot' };

      const res = await axios.get(encodedUri, { headers: headers });
      const html = res.data;
      const dom = new JSDOM(html);
      const meta = dom.window.document.head.querySelectorAll('meta');
      const ogp: any = extractOgp([...meta]);

      this.logger.log(`url=${url}, ogp=${safeStringify(ogp)}`);

      return {
        type: ogp['og:type'] || '',
        title: ogp['og:title'] || '',
        description: ogp['og:description'] || '',
        img: ogp['og:img'] || ogp['og:image'] || '',
        siteName: ogp['og:siteName'] || ogp['og:site_name'] || '',
        url: ogp['og:url'] || '',
      };
    } catch (error) {
      this.logger.error(error);
      return {
        message: 'failed to parse ogp',
      };
    }
  }
}
