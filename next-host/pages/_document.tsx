import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    let pageProps = null;

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceApp: (App: any) => (props: any) => {
          pageProps = props.pageProps;
          return <App {...props} />;
        },
        enhanceComponent: (Component: any) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, pageProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* @ts-ignore */}
          {this.props.pageProps.preReadyEmotionStyles && this.props.pageProps.preReadyEmotionStyles.map((style: any) => {
              return (
                <style
                  key={style.key}
                  data-emotion={style.styleId}
                  dangerouslySetInnerHTML={{ __html: style.styles }}
                />
              );
            })}
            {/* @ts-ignore */}
          {this.props.pageProps?._nextI18Next?.i18nBasePath && <script src={`${this.props.pageProps._nextI18Next.i18nBasePath}/${this.props.locale}/common-i18n-loader.js`}
            defer={true}
          />}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
