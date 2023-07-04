import React from 'react';

interface IProps {
    onRefresh: () => any;
}

class ErrorBoundary extends React.Component<IProps> {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(errorInfo, error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <p style={{ width: '100%', textAlign: 'center' }}>
                        好像出现了点问题～
                        <br />
                        检查左侧JSON配置后，点击
                        <a
                            onClick={() => {
                                this.props?.onRefresh();
                                setTimeout(() => {
                                    this.setState({ hasError: false });
                                }, 200);
                            }}
                        >
                            刷新
                        </a>
                        重试
                    </p>
                </div>
            );
        }
        return <>{this.props.children}</>;
    }
}

export default ErrorBoundary;
