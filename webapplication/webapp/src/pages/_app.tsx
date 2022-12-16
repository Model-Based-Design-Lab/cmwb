import React from 'react'
import App from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'
import 'w3-css/w3.css'
import { Container, SSRProvider } from 'react-bootstrap'
import Navigation from '../components/Navigation/Navigation'
import { Footer } from '../components/Footer/Footer'

class MyApp extends App {

    declare state: any

    static async getInitialProps({ Component, ctx }: any) {
        let pageProps: any = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        if (ctx.req && ctx.req.session && ctx.req.session.passport) {
            pageProps.user = ctx.req.session.passport.user
        }
        pageProps.quiz = false
        if (ctx.req && ctx.req.session && ctx.req.session.quiz) {
            pageProps.quiz = ctx.req.session.quiz
        }
        pageProps.localMode = global.localMode
        return { pageProps }
    }

    constructor(props: any) {
        super(props)
        this.state = {
            user: props.pageProps.user,
            quiz: props.pageProps.quiz
        }
    }


    render() {
        const { Component, pageProps } = this.props

        const props = {
            ...pageProps,
            user: this.state.user,
        }

        return (
            <SSRProvider>
                <Container fluid>
                    <nav>
                        <Navigation {...pageProps}></Navigation>
                    </nav>
                    <article>
                        <Component {...pageProps} />
                    </article>
                    <Footer/>
                </Container>
            </SSRProvider>
        )
    }
}

export default MyApp