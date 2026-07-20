import { buildOdoUrl, isOdoUrl } from '../../src/module/api/odoClient.js';

describe('buildOdoUrl', () => {
  it('joins the base and the path', () => {
    expect(buildOdoUrl('/personagens.json', 'https://olddragon.com.br')).toBe(
      'https://olddragon.com.br/personagens.json',
    );
  });

  it('tolerates a trailing slash on the base', () => {
    expect(buildOdoUrl('/token', 'https://olddragon.com.br/')).toBe('https://olddragon.com.br/token');
  });

  it('supports a development host with a port', () => {
    expect(buildOdoUrl('/personagens/abc.json', 'http://olddragon.test:3027')).toBe(
      'http://olddragon.test:3027/personagens/abc.json',
    );
  });
});

describe('isOdoUrl', () => {
  it('accepts a URL on the configured host', () => {
    expect(isOdoUrl('https://olddragon.com.br/personagens/abc', 'https://olddragon.com.br')).toBe(true);
  });

  it('accepts a URL on a configured development host', () => {
    expect(isOdoUrl('http://olddragon.test:3027/personagens/abc', 'http://olddragon.test:3027')).toBe(true);
  });

  it('rejects a URL on a different host', () => {
    expect(isOdoUrl('https://example.com/personagens/abc', 'https://olddragon.com.br')).toBe(false);
  });

  it('rejects text that is not a URL', () => {
    expect(isOdoUrl('não é uma url', 'https://olddragon.com.br')).toBe(false);
  });
});
