export interface DeviceConfig {
    id: string;
    name: string;
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
}

export const devices: DeviceConfig[] = [
    {
        id: 'iphone-14-pro-max',
        name: 'iPhone 14 Pro Max',
        width: 430,
        height: 932,
        deviceScaleFactor: 3,
        isMobile: true
    },
    {
        id: 'iphone-14-pro',
        name: 'iPhone 14 Pro',
        width: 393,
        height: 852,
        deviceScaleFactor: 3,
        isMobile: true
    },
    {
        id: 'iphone-14-plus',
        name: 'iPhone 14 Plus',
        width: 428,
        height: 926,
        deviceScaleFactor: 3,
        isMobile: true
    },
    {
        id: 'iphone-14',
        name: 'iPhone 14',
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true
    },
    {
        id: 'pixel-7-pro',
        name: 'Pixel 7 Pro',
        width: 412,
        height: 915,
        deviceScaleFactor: 3.5,
        isMobile: true
    },
    {
        id: 'samsung-s23-ultra',
        name: 'Samsung S23 Ultra',
        width: 412,
        height: 915,
        deviceScaleFactor: 3.5,
        isMobile: true
    },
    {
        id: 'full-screen',
        name: '全屏',
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        isMobile: false
    }
];

