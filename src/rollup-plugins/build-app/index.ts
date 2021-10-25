import { OutputChunk, Plugin } from 'rollup';

export const INJECT_IMPORT_MAPS = (import_maps: any = {}) => (`
if (window['$_systemjs_tools_'] && typeof window['$_systemjs_tools_'].url === 'string') {
    window['$_systemjs_tools_'].url(${JSON.stringify(import_maps)});
}
`)

export default function(import_maps = {}):Plugin {
    return {
        name: 'app-builder',
        async generateBundle(_, bundle) {
            if (import_maps && Object.keys(import_maps).length) {
                const [_, entryChunk ] = Object.entries(bundle).find(([_, chunk]) => (chunk as OutputChunk).isEntry) as [string, OutputChunk];
                entryChunk.code = INJECT_IMPORT_MAPS(import_maps) + '\n' + entryChunk.code;
            }
        }
    }
}
