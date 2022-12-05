/**
 * @author mrdoob / http://mrdoob.com/
 */

//
class CSS3DStereoRenderer {
    constructor(parameters = {}) {
        const _this = this;

        let _width, _height;
        let _widthHalf, _heightHalf;
        let _cameraL, _cameraR;

        const cache = {
            camera: { fov: 0 },
            objects: new WeakMap()
        };

        var _stereo = new THREE.StereoCamera();
        _stereo.aspect = 0.5;

        const domElement = parameters.element !== undefined ? parameters.element : document.createElement('div');

        domElement.style.overflow = 'hidden';

        this.domElement = domElement;

        var domElementL = document.createElement('div');
        domElementL.style.display = 'inline-block';
        domElementL.style.overflow = 'hidden';

        domElementL.style.WebkitTransformStyle = 'preserve-3d';
        domElementL.style.MozTransformStyle = 'preserve-3d';
        domElementL.style.oTransformStyle = 'preserve-3d';
        domElementL.style.transformStyle = 'preserve-3d';

        domElement.appendChild(domElementL);

        var cameraElementL = document.createElement('div');

        cameraElementL.style.WebkitTransformStyle = 'preserve-3d';
        cameraElementL.style.MozTransformStyle = 'preserve-3d';
        cameraElementL.style.oTransformStyle = 'preserve-3d';
        cameraElementL.style.transformStyle = 'preserve-3d';

        domElementL.appendChild(cameraElementL);

        //

        var domElementR = document.createElement('div');
        domElementR.style.display = 'inline-block';
        domElementR.style.overflow = 'hidden';

        domElementR.style.WebkitTransformStyle = 'preserve-3d';
        domElementR.style.MozTransformStyle = 'preserve-3d';
        domElementR.style.oTransformStyle = 'preserve-3d';
        domElementR.style.transformStyle = 'preserve-3d';

        domElement.appendChild(domElementR);

        var cameraElementR = document.createElement('div');

        cameraElementR.style.WebkitTransformStyle = 'preserve-3d';
        cameraElementR.style.MozTransformStyle = 'preserve-3d';
        cameraElementR.style.oTransformStyle = 'preserve-3d';
        cameraElementR.style.transformStyle = 'preserve-3d';

        domElementR.appendChild(cameraElementR);

        this.setClearColor = function () {

        };

        this.setSize = function (width, height) {

            domElement.style.width = width + 'px';
            domElement.style.height = height + 'px';

            _width = width;
            _height = height;

            _widthHalf = _width / 2;
            _heightHalf = _height / 2;

            domElementL.style.width = _width + 'px';
            domElementL.style.height = _height + 'px';

            cameraElementL.style.width = _width + 'px';
            cameraElementL.style.height = _height + 'px';

            domElementR.style.width = _width + 'px';
            domElementR.style.height = _height + 'px';

            cameraElementR.style.width = _width + 'px';
            cameraElementR.style.height = _height + 'px';

        };

        function epsilon(value) {

            return Math.abs(value) < Number.EPSILON ? 0 : value;

        };

        function getCameraCSSMatrix(matrix) {

            const elements = matrix.elements;

            return 'matrix3d(' +
                epsilon(elements[0]) + ',' +
                epsilon(- elements[1]) + ',' +
                epsilon(elements[2]) + ',' +
                epsilon(elements[3]) + ',' +
                epsilon(elements[4]) + ',' +
                epsilon(- elements[5]) + ',' +
                epsilon(elements[6]) + ',' +
                epsilon(elements[7]) + ',' +
                epsilon(elements[8]) + ',' +
                epsilon(- elements[9]) + ',' +
                epsilon(elements[10]) + ',' +
                epsilon(elements[11]) + ',' +
                epsilon(elements[12]) + ',' +
                epsilon(- elements[13]) + ',' +
                epsilon(elements[14]) + ',' +
                epsilon(elements[15]) +
                ')';

        }

        function getObjectCSSMatrix(matrix) {

            const elements = matrix.elements;
            const matrix3d = 'matrix3d(' +
                epsilon(elements[0]) + ',' +
                epsilon(elements[1]) + ',' +
                epsilon(elements[2]) + ',' +
                epsilon(elements[3]) + ',' +
                epsilon(- elements[4]) + ',' +
                epsilon(- elements[5]) + ',' +
                epsilon(- elements[6]) + ',' +
                epsilon(- elements[7]) + ',' +
                epsilon(elements[8]) + ',' +
                epsilon(elements[9]) + ',' +
                epsilon(elements[10]) + ',' +
                epsilon(elements[11]) + ',' +
                epsilon(elements[12]) + ',' +
                epsilon(elements[13]) + ',' +
                epsilon(elements[14]) + ',' +
                epsilon(elements[15]) +
                ')';

            return 'translate(-50%,-50%)' + matrix3d;

        }

        function renderObject(object, scene, camera, cameraElement, side) {

            if (object.isCSS3DObject) {

                const visible = (object.visible === true) && (object.layers.test(camera.layers) === true);
                object.element.style.display = (visible === true) ? '' : 'none';

                if (visible === true) {

                    object.onBeforeRender(_this, scene, camera);

                    let style;

                    if (object.isCSS3DSprite) {

                        // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

                        _matrix.copy(camera.matrixWorldInverse);
                        _matrix.transpose();

                        if (object.rotation2D !== 0) _matrix.multiply(_matrix2.makeRotationZ(object.rotation2D));

                        object.matrixWorld.decompose(_position, _quaternion, _scale);
                        _matrix.setPosition(_position);
                        _matrix.scale(_scale);

                        _matrix.elements[3] = 0;
                        _matrix.elements[7] = 0;
                        _matrix.elements[11] = 0;
                        _matrix.elements[15] = 1;

                        style = getObjectCSSMatrix(_matrix);

                    } else {

                        style = getObjectCSSMatrix(object.matrixWorld);

                    }

                    //const element = object['element' + side];
                    const element = object.element;

                    const cachedObject = cache.objects.get(object);

                    if (cachedObject === undefined || cachedObject.style !== style) {

                        element.style.WebkitTransform = style;
                        element.style.MozTransform = style;
                        element.style.oTransform = style;
                        element.style.transform = style;

                        const objectData = { style: style };
                        cache.objects.set(object, objectData);

                    }



                    if (element.parentNode !== cameraElement) {

                        cameraElement.appendChild(element);

                    }
                    object.onAfterRender(_this, scene, camera);

                }

            }

            for (var i = 0, l = object.children.length; i < l; i++) {

                renderObject(object.children[i], scene, camera, cameraElement, side);

            }

        }

        this.render = function (scene, camera) {

            const fov = camera.projectionMatrix.elements[5] * _heightHalf;

            if (cache.camera.fov !== fov) {

                domElement.style.perspective = camera.isPerspectiveCamera ? fov + 'px' : '';
                cache.camera.fov = fov;

            }

            if (scene.autoUpdate === true) scene.updateMatrixWorld();
            if (camera.parent === null) camera.updateMatrixWorld();

            _stereo.update(camera);

            //var fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * _height;

            // Left

            _cameraL = _stereo.cameraL;

            domElementL.style.WebkitPerspective = fov + "px";
            domElementL.style.MozPerspective = fov + "px";
            domElementL.style.oPerspective = fov + "px";
            domElementL.style.perspective = fov + "px";

            var cameraCSSMatrix = _cameraL.isOrthographicCamera ?
                'scale(' + fov + ')' + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + getCameraCSSMatrix(_cameraL.matrixWorldInverse) :
                'translateZ(' + fov + 'px)' + getCameraCSSMatrix(_cameraL.matrixWorldInverse);

            var style = cameraCSSMatrix +
                'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

            cameraElementL.style.WebkitTransform = style;
            cameraElementL.style.MozTransform = style;
            cameraElementL.style.oTransform = style;
            cameraElementL.style.transform = style;

            renderObject(scene, scene, _cameraL, cameraElementL, 'L');

            // Right

            _cameraR = _stereo.cameraR;

            domElementR.style.WebkitPerspective = fov + "px";
            domElementR.style.MozPerspective = fov + "px";
            domElementR.style.oPerspective = fov + "px";
            domElementR.style.perspective = fov + "px";

            var cameraCSSMatrix = _cameraR.isOrthographicCamera ?
                'scale(' + fov + ')' + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + getCameraCSSMatrix(_cameraR.matrixWorldInverse) :
                'translateZ(' + fov + 'px)' + getCameraCSSMatrix(_cameraR.matrixWorldInverse);

            var style = cameraCSSMatrix +
                'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

            cameraElementR.style.WebkitTransform = style;
            cameraElementR.style.MozTransform = style;
            cameraElementR.style.oTransform = style;
            cameraElementR.style.transform = style;

            renderObject(scene, scene, _cameraR, cameraElementR, 'R');

        };
    }

}
