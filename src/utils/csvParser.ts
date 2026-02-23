import type { Device } from '@/types';

export const parseCSV = (file: File): Promise<Partial<Device>[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            const devices: Partial<Device>[] = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const values = line.split(',').map(v => v.trim());
                const device: any = {};

                headers.forEach((header, index) => {
                    const value = values[index];
                    if (value) {
                        // Map common CSV headers to Device type properties
                        const key = mapHeaderToProperty(header);
                        if (key) {
                            device[key] = value;
                        }
                    }
                });

                if (Object.keys(device).length > 0) {
                    // Set default status if not provided
                    if (!device.status) {
                        device.status = 'received';
                    }
                    // Set default category if not provided
                    if (!device.category) {
                        device.category = 'Laptop'; // Default or handle based on logic
                    }

                    devices.push(device);
                }
            }
            resolve(devices);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

const mapHeaderToProperty = (header: string): keyof Device | null => {
    const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (normalized.includes('serial')) return 'serialNumber';
    if (normalized.includes('bar') || normalized.includes('code')) return 'barcode';
    if (normalized.includes('brand') || normalized.includes('make')) return 'brand';
    if (normalized.includes('model')) return 'model';
    if (normalized.includes('cat')) return 'category';
    if (normalized.includes('proc') || normalized.includes('cpu')) return 'processor';
    if (normalized.includes('ram') || normalized.includes('memory')) return 'ram';
    if (normalized.includes('hdd') || normalized.includes('ssd') || normalized.includes('storage')) return 'storage';
    if (normalized.includes('display') || normalized.includes('screen')) return 'displaySize';
    if (normalized.includes('grade')) return 'grade';

    return null;
};
