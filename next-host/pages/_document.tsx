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
