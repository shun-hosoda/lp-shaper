(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/validations/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loginSchema",
    ()=>loginSchema,
    "registerSchema",
    ()=>registerSchema,
    "resetPasswordRequestSchema",
    ()=>resetPasswordRequestSchema,
    "resetPasswordSchema",
    ()=>resetPasswordSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'パスワードは8文字以上で入力してください').max(72, 'パスワードは72文字以下で入力してください'),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'パスワード（確認）を入力してください')
}).refine((data)=>data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: [
        'confirmPassword'
    ]
});
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'パスワードを入力してください')
});
const resetPasswordRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください')
});
const resetPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'パスワードは8文字以上で入力してください').max(72, 'パスワードは72文字以下で入力してください'),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'パスワード（確認）を入力してください')
}).refine((data)=>data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: [
        'confirmPassword'
    ]
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/actions/data:dbd9e4 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"600ae765ccf111b855be46decb84ac897ce5f51f50":"login"},"src/actions/auth.ts",""] */ __turbopack_context__.s([
    "login",
    ()=>login
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var login = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("600ae765ccf111b855be46decb84ac897ce5f51f50", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "login"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcclxuXHJcbmltcG9ydCB7IHJlZGlyZWN0IH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAL2xpYi9zdXBhYmFzZS9zZXJ2ZXInXHJcbmltcG9ydCB7XHJcbiAgbG9naW5TY2hlbWEsXHJcbiAgcmVnaXN0ZXJTY2hlbWEsXHJcbiAgcmVzZXRQYXNzd29yZFJlcXVlc3RTY2hlbWEsXHJcbiAgcmVzZXRQYXNzd29yZFNjaGVtYSxcclxuICB0eXBlIExvZ2luSW5wdXQsXHJcbiAgdHlwZSBSZWdpc3RlcklucHV0LFxyXG4gIHR5cGUgUmVzZXRQYXNzd29yZFJlcXVlc3RJbnB1dCxcclxuICB0eXBlIFJlc2V0UGFzc3dvcmRJbnB1dCxcclxufSBmcm9tICdAL2xpYi92YWxpZGF0aW9ucy9hdXRoJ1xyXG5cclxuLyoqIOODpuODvOOCtuODvOWQkeOBkeOCqOODqeODvOODoeODg+OCu+ODvOOCuOOBruODnuODg+ODlOODs+OCsCAqL1xyXG5mdW5jdGlvbiBtYXBBdXRoRXJyb3IobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAobWVzc2FnZS5pbmNsdWRlcygnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscycpKSB7XHJcbiAgICByZXR1cm4gJ+ODoeODvOODq+OCouODieODrOOCueOBvuOBn+OBr+ODkeOCueODr+ODvOODieOBjOato+OBl+OBj+OBguOCiuOBvuOBm+OCkydcclxuICB9XHJcbiAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoJ0VtYWlsIGFscmVhZHkgcmVnaXN0ZXJlZCcpIHx8IG1lc3NhZ2UuaW5jbHVkZXMoJ1VzZXIgYWxyZWFkeSByZWdpc3RlcmVkJykpIHtcclxuICAgIHJldHVybiAn44GT44Gu44Oh44O844Or44Ki44OJ44Os44K544Gv44GZ44Gn44Gr55m76Yyy44GV44KM44Gm44GE44G+44GZJ1xyXG4gIH1cclxuICBpZiAobWVzc2FnZS5pbmNsdWRlcygnRW1haWwgbm90IGNvbmZpcm1lZCcpKSB7XHJcbiAgICByZXR1cm4gJ+ODoeODvOODq+OCouODieODrOOCueOBrueiuuiqjeOBjOWujOS6huOBl+OBpuOBhOOBvuOBm+OCk+OAgueiuuiqjeODoeODvOODq+OCkuOBlOeiuuiqjeOBj+OBoOOBleOBhCdcclxuICB9XHJcbiAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoJ3JhdGUnKSkge1xyXG4gICAgcmV0dXJuICfjgZfjgbDjgonjgY/mmYLplpPjgpLjgYrjgYTjgabjgYvjgonlho3oqabooYzjgZfjgabjgY/jgaDjgZXjgYQnXHJcbiAgfVxyXG4gIHJldHVybiAn5LqI5pyf44GX44Gq44GE44Ko44Op44O844GM55m655Sf44GX44G+44GX44Gf44CC44GX44Gw44KJ44GP57WM44Gj44Gm44GL44KJ5YaN6Kmm6KGM44GX44Gm44GP44Gg44GV44GEJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYW5pdGl6ZVJlZGlyZWN0UGF0aChwYXRoPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIXBhdGggfHwgIXBhdGguc3RhcnRzV2l0aCgnLycpIHx8IHBhdGguc3RhcnRzV2l0aCgnLy8nKSkge1xyXG4gICAgcmV0dXJuICcvaG9tZSdcclxuICB9XHJcbiAgcmV0dXJuIHBhdGhcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXV0aENhbGxiYWNrQmFzZVVybCgpOiBzdHJpbmcge1xyXG4gIHJldHVybiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUFBfVVJMID8/ICdodHRwOi8vbG9jYWxob3N0OjMxMDAnXHJcbn1cclxuXHJcbi8qKiBGUi0wMDE6IOODoeODvOODqy/jg5Hjgrnjg6/jg7zjg4nnmbvpjLIgKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyKGlucHV0OiBSZWdpc3RlcklucHV0KSB7XHJcbiAgY29uc3QgcGFyc2VkID0gcmVnaXN0ZXJTY2hlbWEuc2FmZVBhcnNlKGlucHV0KVxyXG4gIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHtcclxuICAgIHJldHVybiB7IGVycm9yOiBwYXJzZWQuZXJyb3IuZmxhdHRlbigpLmZpZWxkRXJyb3JzIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25VcCh7XHJcbiAgICBlbWFpbDogcGFyc2VkLmRhdGEuZW1haWwsXHJcbiAgICBwYXNzd29yZDogcGFyc2VkLmRhdGEucGFzc3dvcmQsXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIGVtYWlsUmVkaXJlY3RUbzogYCR7Z2V0QXV0aENhbGxiYWNrQmFzZVVybCgpfS9hdXRoL2NvbmZpcm1gLFxyXG4gICAgfSxcclxuICB9KVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiB7IGVycm9yOiBtYXBBdXRoRXJyb3IoZXJyb3IubWVzc2FnZSkgfVxyXG4gIH1cclxuXHJcbiAgLy8g56K66KqN44Oh44O844Or6YCB5L+h5riI44G/IOKGkiB2ZXJpZnktZW1haWwg44Oa44O844K444G4XHJcbiAgcmVkaXJlY3QoJy92ZXJpZnktZW1haWwnKVxyXG59XHJcblxyXG4vKiogRlItMDAyOiDjg6Hjg7zjg6sv44OR44K544Ov44O844OJ44Ot44Kw44Kk44OzICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbihpbnB1dDogTG9naW5JbnB1dCwgcmVkaXJlY3RUbz86IHN0cmluZykge1xyXG4gIGNvbnN0IHBhcnNlZCA9IGxvZ2luU2NoZW1hLnNhZmVQYXJzZShpbnB1dClcclxuICBpZiAoIXBhcnNlZC5zdWNjZXNzKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogcGFyc2VkLmVycm9yLmZsYXR0ZW4oKS5maWVsZEVycm9ycyB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduSW5XaXRoUGFzc3dvcmQoe1xyXG4gICAgZW1haWw6IHBhcnNlZC5kYXRhLmVtYWlsLFxyXG4gICAgcGFzc3dvcmQ6IHBhcnNlZC5kYXRhLnBhc3N3b3JkLFxyXG4gIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IG1hcEF1dGhFcnJvcihlcnJvci5tZXNzYWdlKSB9XHJcbiAgfVxyXG5cclxuICByZWRpcmVjdChzYW5pdGl6ZVJlZGlyZWN0UGF0aChyZWRpcmVjdFRvKSlcclxufVxyXG5cclxuLyoqIEZSLTAwODog44Ot44Kw44Ki44Km44OIICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG4gIGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpXHJcbiAgcmVkaXJlY3QoJy9sb2dpbicpXHJcbn1cclxuXHJcbi8qKiBGUi0wMDQ6IOODkeOCueODr+ODvOODieODquOCu+ODg+ODiOeUs+iri++8iOODoeODvOODq+mAgeS/oe+8iSAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWVzdFBhc3N3b3JkUmVzZXQoaW5wdXQ6IFJlc2V0UGFzc3dvcmRSZXF1ZXN0SW5wdXQpIHtcclxuICBjb25zdCBwYXJzZWQgPSByZXNldFBhc3N3b3JkUmVxdWVzdFNjaGVtYS5zYWZlUGFyc2UoaW5wdXQpXHJcbiAgaWYgKCFwYXJzZWQuc3VjY2Vzcykge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IHBhcnNlZC5lcnJvci5mbGF0dGVuKCkuZmllbGRFcnJvcnMgfVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGgucmVzZXRQYXNzd29yZEZvckVtYWlsKHBhcnNlZC5kYXRhLmVtYWlsLCB7XHJcbiAgICByZWRpcmVjdFRvOiBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw/LnJlcGxhY2UoJzo4MDAwJywgJzozMDAwJykgPz8gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCd9L2F1dGgvY2FsbGJhY2s/dHlwZT1yZWNvdmVyeWAsXHJcbiAgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogbWFwQXV0aEVycm9yKGVycm9yLm1lc3NhZ2UpIH1cclxuICB9XHJcblxyXG4gIC8vIOODoeODvOODq+WIl+aMmeWvvuetljog5oiQ5Yqf5Y+v5ZCm44Gr6Zai44KP44KJ44Ga5ZCM44GY44Oh44OD44K744O844K444KS6L+U44GZXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbi8qKiBGUi0wMDQ6IOaWsOODkeOCueODr+ODvOODieioreWumiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzZXRQYXNzd29yZChpbnB1dDogUmVzZXRQYXNzd29yZElucHV0KSB7XHJcbiAgY29uc3QgcGFyc2VkID0gcmVzZXRQYXNzd29yZFNjaGVtYS5zYWZlUGFyc2UoaW5wdXQpXHJcbiAgaWYgKCFwYXJzZWQuc3VjY2Vzcykge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IHBhcnNlZC5lcnJvci5mbGF0dGVuKCkuZmllbGRFcnJvcnMgfVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGgudXBkYXRlVXNlcih7XHJcbiAgICBwYXNzd29yZDogcGFyc2VkLmRhdGEucGFzc3dvcmQsXHJcbiAgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogbWFwQXV0aEVycm9yKGVycm9yLm1lc3NhZ2UpIH1cclxuICB9XHJcblxyXG4gIHJlZGlyZWN0KCcvbG9naW4nKVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoia1JBb0VzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/LoginForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginForm",
    ()=>LoginForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validations$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validations/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$dbd9e4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/actions/data:dbd9e4 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function LoginForm(param) {
    let { redirectTo } = param;
    _s();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const { register, handleSubmit, setError, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validations$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginSchema"])
    });
    const onSubmit = (data)=>{
        startTransition(async ()=>{
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$dbd9e4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["login"])(data, redirectTo);
            if (result === null || result === void 0 ? void 0 : result.error) {
                setError('root', {
                    message: typeof result.error === 'string' ? result.error : 'ログインに失敗しました'
                });
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit(onSubmit),
        noValidate: true,
        children: [
            errors.root && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                className: "form-alert",
                children: errors.root.message
            }, void 0, false, {
                fileName: "[project]/src/components/auth/LoginForm.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "form-group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "form-label",
                        children: "メールアドレス"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginForm.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "email",
                        type: "email",
                        autoComplete: "email",
                        className: "form-input",
                        "aria-invalid": !!errors.email,
                        ...register('email')
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginForm.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "form-error",
                        children: errors.email.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginForm.tsx",
                        lineNumber: 58,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/LoginForm.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "form-group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "password",
                        className: "form-label",
                        children: "パスワード"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginForm.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "password",
                        type: "password",
                        autoComplete: "current-password",
                        className: "form-input",
                        "aria-invalid": !!errors.password,
                        ...register('password')
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginForm.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "form-error",
                        children: errors.password.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth/LoginForm.tsx",
                        lineNumber: 71,
                        columnNumber: 29
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/LoginForm.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isPending,
                "aria-busy": isPending,
                className: "btn-primary mt-2",
                children: isPending ? '処理中...' : 'ログイン'
            }, void 0, false, {
                fileName: "[project]/src/components/auth/LoginForm.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth/LoginForm.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(LoginForm, "oARkXiBEWdkcA4JBReWt/Jtt6Bc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = LoginForm;
var _c;
__turbopack_context__.k.register(_c, "LoginForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "http://localhost:8100"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth/OAuthButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OAuthButton",
    ()=>OAuthButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const PROVIDER_LABELS = {
    google: 'Googleでログイン'
};
function OAuthButton(param) {
    let { provider, redirectTo = '/home', className } = param;
    _s();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleClick() {
        setIsLoading(true);
        setError(null);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: "".concat(window.location.origin, "/auth/callback?next=").concat(encodeURIComponent(redirectTo)),
                scopes: 'openid email profile'
            }
        });
        if (error) {
            setError('ソーシャルログインに失敗しました。しばらく経ってから再試行してください');
            setIsLoading(false);
        }
    // 成功時はブラウザが OAuth URL へリダイレクトするため setIsLoading(false) 不要
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleClick,
                disabled: isLoading,
                "aria-busy": isLoading,
                className: "btn-outline",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4 mr-2",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#4285F4",
                                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OAuthButton.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#34A853",
                                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OAuthButton.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#FBBC05",
                                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OAuthButton.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#EA4335",
                                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth/OAuthButton.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth/OAuthButton.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    isLoading ? '処理中...' : PROVIDER_LABELS[provider]
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth/OAuthButton.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                className: "form-error mt-2",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/auth/OAuthButton.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth/OAuthButton.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(OAuthButton, "vj++RuHna9NxFPGCY0p/mi1GZNM=");
_c = OAuthButton;
var _c;
__turbopack_context__.k.register(_c, "OAuthButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_92ef747a._.js.map