<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All portfolio content, asset URLs and social links live in src/config/site.ts; `null` hides/disables the related UI so nothing is faked.
- The Work circular reveal is triggered only by explicit clicks via WorkRevealProvider (src/components/WorkReveal.tsx); never by scroll.
- /work and /skills both render src/components/Workspace.tsx (one app window, view prop) so switching keeps the shell; why: workspace-integrated Skills.
- Welcome uses the vendored ThreeUI bundle in src/shaders/ (npm package doesn't exist); unused source html files are placeholders; why: exact registered source.
- Skill logos come from simple-icons via src/lib/skill-icons.ts named imports only; skills without an official mark use a text tile; why: bundle size, no fake logos.
- Navbar uses a tightly cropped, stroke-thickened transparent derivative of the supplied monogram (dr-monogram-bold); dark backgrounds use CSS inversion; why: legible bold mark without redesigning it.
- Home and workspace viewport sizing lives in global layout classes; the shared app window constrains project previews with a flex remainder and contain sizing to avoid cropping.
- Binary assets (images, logo, GLB with embedded textures, resume) live as real files in public/assets/ and are referenced by root paths in src/config/site.ts; why: exported source must run locally without CDN pointer files.
