import fs from 'fs';

export default function vd({ types: t }) {
  const visitor = {
    Program(path, _ref) {
      const { opts } = _ref;
      const { node, hub } = path;
      const { file } = hub;
      file.metadata.modules.imports.forEach(module => {
        if (opts.library.indexOf(module.source) === -1) {
          return false;
        }
        const specs = module.specifiers;
        specs.forEach(spec => {
          const { imported, local } = spec;
          const binding = file.scope.getBinding(local);
          const { importKind = 'value' } = binding.path.parent;

          // Skip type annotation imports.
          if (importKind != 'value') {
            return false;
          }

          binding.referencePaths.forEach(refPath => {
            const { node, parentPath } = refPath;
            const { type } = node;
            if (imported && imported != 'default') {
              const libName = `${module.source}/${imported}`;
              const { name } = file.addImport(libName, 'default', imported);
              refPath.replaceWith({ type, name });
            }
          });

        });
      });
    },
    ImportDeclaration(path, _ref) {
      const { opts } = _ref;
      // const { node, hub } = path;
      // const { file } = hub;
      // const { type, source, specifiers } = node;
      // const lib = source.value;
      // specifiers.forEach(spec => {
      //   if (t.isImportSpecifier(spec)) {
      //     const { imported, local } = spec;
      //     const { name } = imported;
      //     const libName = `${lib}/${name}`;
      //     // fs.writeFileSync('import.txt', JSON.stringify(t.importDeclaration([t.ImportDefaultSpecifier(t.identifier(name))], t.stringLiteral(libName)), null, 2));
      //     // const importDeclaration = t.importDeclaration([t.ImportDefaultSpecifier(t.identifier(name))], t.stringLiteral(libName));
      //     // path.insertAfter(importDeclaration);
      //     console.log(libName, name);
      //     const binding = file.scope.getBinding(local);
      //     console.log(binding, local);
      //     file.addImport(libName, 'default', name);
      //     // path.parentPath.replaceWith({ type, name });
      //   }
      // });
      // Remove old import.
      // path.remove();
      if (opts.library.indexOf(path.node.source.value) !== -1) {
        // Remove old import.
        path.remove();
      }
    },
  };

  return { visitor };
};
