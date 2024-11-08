import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {addCourseDetails, editCourseDetails, fetchCourseCategories} from '../../../../../services/operations/courseDetailsAPI'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import RequirementFields from './RequirementFields'
import  {setStep, setCourse } from '../../../../../slices/courseSlice'
import IconBtn from '../../../../common/IconBtn'
import toast from 'react-hot-toast'
import {COURSE_STATUS} from '../../../../../utils/constants'
import { MdNavigateNext } from 'react-icons/md'
import ChipInput from './ChipInput'
import Upload from '../Upload'
 const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode
    if (editCourse) {
      // console.log("data populated", editCourse)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmitForm = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log(data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    let formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)

  //   for (var key of formData.entries()) {
  //     console.log(key[0] + ', ' + key[1]);
  // }

    setLoading(true)
    const result = await addCourseDetails(formData, token)
    // console.log(result)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className=' rounded-md border-richblack-700 bg-primaryDark p-6 space-y-8 border-[1px]'>
       
             {/* Course Title */}
       <div className="flex flex-col space-y-2">
        <label  className="text-sm text-primaryLight" htmlFor='courseTitle'>
          Course Title<sup className="text-pink-200">*</sup>
        </label>

        <input
          id='courseTitle'
          placeholder='Enter course title'
          {...register('courseTitle' , {required:true})}
          className=' form-style w-full'
        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required</span>
          )
        }
       </div>

      {/* Course Short Description */}
       <div className="flex flex-col space-y-2">
         <label  className="text-sm text-primaryLight" htmlFor='courseShortDesc'>Course Short Description<sup className="text-pink-200">*</sup></label>
         <textarea
         id='courseShortDesc'
         placeholder='Enter Description'
         {...register('courseShortDesc' , {required:true})}
         className='form-style resize-x-none min-h-[130px] w-full'
         />
         {
          errors.courseShortDesc && (<span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>)
         }
       </div>

      {/* Course Price */}
       <div className="flex flex-col space-y-2">
         <label  className="text-sm text-primaryLight" htmlFor='coursePrice'>Course Price<sup className="text-pink-200">*</sup></label>
         <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-primaryLight" />
        </div>
         {
          errors.coursePrice && (<span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>)
         }
       </div>
      
      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label  className="text-sm text-primaryLight" htmlFor='courseCategory'>Course Category <sup className="text-pink-200">*</sup></label>
        <select id='courseCategory'
          defaultValue=""
          {...register('courseCategory' , {required:true})}
          className='form-style w-full'
        >
          <option value="" disabled className=' text-white'>Choose a Category</option>
          {
            !loading && courseCategories.map((category , index) =>(
              <option key={index} value={category?._id}>
                {category.name}
              </option>
            ))
          }

        </select>
        {
          errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Category is required
            </span>
          )
        }
      </div>
      {/* course tags*/}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* create a component fro uploading and preview of media */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label  className="text-sm text-primaryLight">Benefits of the course<sup className="text-pink-200">*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Benefits of the course'
          {...register('courseBenefits' , {required:true})}
          className='form-style resize-x-none min-h-[130px] w-full'
        />
        {
          errors.courseBenefits && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Benefits of the course is required
            </span>
          )
        }
      </div>

      {/* Requirements/Instructions */}
      <RequirementFields
        name="courseRequirements"
          label="Requirements/Instructions"
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
      />
      {/* next button */}
      <div className="flex justify-end gap-x-2">
        {
          editCourse && (
            <button onClick={() => dispatch(setStep(2))}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-primaryDark4 py-[8px] px-[20px] font-semibold text-primaryLight`}>
              Continue Without Saving
            </button>
          )
        }
        <IconBtn disabled={loading} text={!editCourse ? 'Next' : 'Save Changes'} className={'group flex text-primaryDark4 justify-center items-center  bg-primaryLight pl-5 pr-5 pt-2  pb-2 font-semibold rounded-md gap-x-2'}>
          <MdNavigateNext className=' font-semibold'/>
        </IconBtn>
      </div>

    </form>
  )
}

export default CourseInformationForm